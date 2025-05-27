/* 설문시작 인적사항 입력 페이지 */
import { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SurveyTop from "../components/survey/SurveyTop";
import Survey_footer from "../components/survey/SurveyFooter";
import { useAppDispatch } from "../hooks/useRedux";
import { PersonalInfo } from "../types/survey";
import { useSurveyStore } from "../hooks/survey/useSurveyStore";
import { info_target_scrFocus, setSurveyToken, target_scrFocus_instant } from "../lib/ui";

export default function SurveyPersonalInfoPage() {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const location = useLocation();
	const { surveyType } = useParams() as { surveyType: string };
	const surveyYear = surveyType.replace("hrm_", "").replace("hrd_", "");
	const { mutate: storeSurvey } = useSurveyStore();

	const [infoData, set_infoData] = useState<PersonalInfo>({
		R_Name: "",
		R_Position: "",
		R_Gender: "",
		R_Tel_No: "",
		R_C_Tel_No: "",
		zonecode: "",
		addr_road: "",
		addr_detail: "",
		R_Email: "",
		R_Div: "",
		R_Company_Name: "",
		R_Part_Name: "",
		R_Cate: "",
		R_Cate_Name: "",
		R_Biz_Reg_No: "",
		R_COMMON_1_1: "",
		R_COMMON_1_2: "",
		R_COMMON_1_3: "",
		R_COMMON_1_4: "",
		R_COMMON_1_5: "",
		R_COMMON_1_6: "",
		R_COMMON_1_7: "",
		R_COMMON_1_8: "",
		R_COMMON_1_9: "",
		R_COMMON_1_10: "",
		recommend: "",
	});
	const inputRefs = useRef<Record<string, HTMLInputElement | HTMLTextAreaElement | null>>({});
	const registerRef = (key: string) => (el: HTMLInputElement | HTMLTextAreaElement | null) => {
		inputRefs.current[key] = el;
	};
	// 개인정보 수집, 이용동의 여부
	const [agree, set_agree] = useState<boolean>(false);
	// 개인정보 수집, 이용동의 열고 닫기
	const [okchk, set_okchk] = useState<boolean>(false);
	/*  */
	//
	const change_infoData = useCallback((e?: ChangeEvent<HTMLInputElement>, addObj: PersonalInfo = {}) => {
		set_infoData((prev) => {
			let obj: PersonalInfo = {
				...prev,
			};
			if (e) obj[e.target.name as keyof PersonalInfo] = e.target.value;
			if (addObj)
				obj = {
					...obj,
					...addObj,
				};
			return obj;
		});
	}, []);
	// 주소 API
	// eslint-disable-next-line
	const postcodeRef = useRef<any>(null);

	const openPostCode = () => {
		postcodeRef.current?.open({ popupKey: "addpopup1" });
	};

	// 제출 검사
	const validateInfoData = (personalInfo: PersonalInfo): { success: boolean; message?: string; focusKey?: keyof PersonalInfo } => {
		// 필수값 확인, 전화번호, 사업자등록번호 체크 등 분리
		const not_required: string[] = [
			"R_Position",
			"R_Tel_No",
			// "addr_road",
			// "addr_detail",
			"R_Part_Name",
			// "R_COMMON_1_1",
			// "R_COMMON_1_2",
			"R_COMMON_1_3",
			"R_COMMON_1_4",
			"R_COMMON_1_5",
			"R_COMMON_1_6",
			"R_COMMON_1_7",
			"R_COMMON_1_8",
			"R_COMMON_1_9",
			"R_COMMON_1_10",
			"recommend",
		];
		const alertNames: PersonalInfo = {
			R_Name: "성명",
			R_Position: "직급",
			R_Gender: "성별",
			R_Tel_No: "사무실 전화번호",
			R_C_Tel_No: "휴대전화번호",
			zonecode: "사무실 주소",
			addr_detail: "상세 주소",
			R_Div: "회사 구분",
			R_Company_Name: "회사(기관)명",
			R_Part_Name: "부서(팀)명",
			R_Cate: "업종",
			R_Cate_Name: "업종명",
			R_Biz_Reg_No: "사업자등록번호",
			R_COMMON_1_1: "매출 총액",
			R_COMMON_1_2: "전체 직원 수",
			R_COMMON_1_3: "",
			R_COMMON_1_4: "",
		};

		// 기타 선택 아니면 기타텍스트 검색안함
		if (personalInfo.R_Cate !== "etc") {
			not_required.push("R_Cate_Name");
		}
		// 공공기관 일 시에 매출 총액, 업종 필수제외
		if (["4", "5"].includes(String(infoData.R_Div))) {
			not_required.push("R_COMMON_1_1", "R_Cate");
		}

		let result: boolean = true;
		let focusKey: keyof PersonalInfo | undefined = undefined;
		let message: string = "";
		for (const key in personalInfo) {
			if (!Object.prototype.hasOwnProperty.call(personalInfo, key)) continue;

			const typedKey = key as keyof PersonalInfo;
			const value = personalInfo[typedKey];

			if (!not_required.includes(typedKey) && inputRefs.current[typedKey] && !value) {
				fail(`${alertNames[typedKey]}를(을) 입력해주세요.`);
				break;
			} else if (["R_Tel_No", "R_C_Tel_No"].includes(typedKey)) {
				let regexp = /^(\d{3})-(\d{3,4})-(\d{4})$/;
				if (typedKey === "R_Tel_No") regexp = /^(\d{2,3})-(\d{3,4})-(\d{4})$/;
				if (value && !regexp.test(value)) {
					fail(`${alertNames[typedKey]} 형식이 맞지 않습니다.`);
					break;
				}
			} else if (typedKey === "R_Biz_Reg_No") {
				personalInfo[typedKey] = value?.replace(/[^0-9]/g, "") || "";
				const numberData = personalInfo[typedKey];
				if (
					numberData.length !== 10 ||
					numberData.startsWith("000") ||
					numberData.slice(3, 5) === "00" ||
					["4444444444", "8888888888"].includes(numberData)
				) {
					fail(`${alertNames[typedKey]} 형식이 맞지 않습니다.`);
					break;
				}
				const biz_value = new Array(10);
				biz_value[0] = (parseFloat(numberData.charAt(0)) * 1) % 10;
				biz_value[1] = (parseFloat(numberData.charAt(1)) * 3) % 10;
				biz_value[2] = (parseFloat(numberData.charAt(2)) * 7) % 10;
				biz_value[3] = (parseFloat(numberData.charAt(3)) * 1) % 10;
				biz_value[4] = (parseFloat(numberData.charAt(4)) * 3) % 10;
				biz_value[5] = (parseFloat(numberData.charAt(5)) * 7) % 10;
				biz_value[6] = (parseFloat(numberData.charAt(6)) * 1) % 10;
				biz_value[7] = (parseFloat(numberData.charAt(7)) * 3) % 10;
				const li_temp = parseFloat(numberData.charAt(8)) * 5 + "0";
				biz_value[8] = parseFloat(li_temp.charAt(0)) + parseFloat(li_temp.charAt(1));
				biz_value[9] = parseFloat(numberData.charAt(9));
				const li_lastid =
					(10 -
						((biz_value[0] +
							biz_value[1] +
							biz_value[2] +
							biz_value[3] +
							biz_value[4] +
							biz_value[5] +
							biz_value[6] +
							biz_value[7] +
							biz_value[8]) %
							10)) %
					10;
				if (biz_value[9] != li_lastid) {
					fail(`${alertNames[typedKey]} 형식이 맞지 않습니다.`);
					break;
				}
			}
			function fail(msg: string) {
				message = msg;
				focusKey = typedKey;
				result = false;
			}
		}
		if (!result) return { success: false, message, focusKey };
		if (!agree) {
			return { success: false, message: "개인정보 수집, 이용 동의를 해주세요." };
		}
		// 저장하기
		storeSurvey(
			{ surveyType, surveyPage: 0, resultInfoData: personalInfo },
			{
				onSuccess: (data) => {
					setSurveyToken(surveyType, data.token);
					navigate(`/survey/${surveyType}/1`, {
						state: { email: location.state?.email },
					});
				},
			}
		);

		return { success: true };
	};

	// 제출
	const submit_infoData = (e: FormEvent) => {
		e.preventDefault();
		const resultInfoData: PersonalInfo = { ...infoData };

		const { success, message, focusKey } = validateInfoData(resultInfoData);
		if (!success) {
			dispatch({ type: "modal/on_modal_alert", payload: message });
			if (focusKey) info_target_scrFocus(inputRefs.current[focusKey]);
			return;
		}
	};

	useEffect(() => {
		target_scrFocus_instant("initScr");
		dispatch({ type: "common/change_curYear", payload: surveyYear });

		if (location.state?.email) {
			change_infoData(undefined, {
				R_Email: location.state.email,
			});
		} else {
			navigate(`/survey/${surveyType}`, { replace: true });
			dispatch({
				type: "modal/on_modal_alert",
				payload: "잘못된 접근입니다.<br>다시 시도해 주세요.",
			});
		}
	}, [dispatch, surveyYear, location.state?.email, change_infoData, navigate, surveyType]);

	useEffect(() => {
		// @ts-expect-error: 'daum' is not defined in TypeScript, but it exists in the global scope
		postcodeRef.current = new window.daum.Postcode({
			oncomplete: (data: { userSelectedType: string; roadAddress: string; jibunAddress: string; zonecode: string }) => {
				set_infoData((prev) => ({
					...prev,
					addr_road: data.userSelectedType === "R" ? data.roadAddress : data.jibunAddress,
					zonecode: data.zonecode,
				}));
			},
		});
	}, []);

	return (
		<form onSubmit={submit_infoData}>
			<div style={{ backgroundColor: "#fff" }}>
				<SurveyTop surveyYear={surveyYear} />
				<div id="initScr" className="end_page page">
					<h2>인재{surveyType.startsWith("hrd") ? "개발" : "채용"} 실태조사</h2>

					<div className="bs-callout bs-callout-warning">
						⊙ 귀하의 의견은 조사 목적에 의해서만 활용될 뿐 개인 또는 기업 정보는 절대 노출되지 않음을 약속드립니다. <br />
						&nbsp;&nbsp;&nbsp;아래의 사항은 분석 결과 보고서의 송부를 위함이오니 빠짐없이 기입해 주시면 감사하겠습니다.
					</div>
					<div className="alert mb10 bg-success text-center">※ 보고서 송부를 위한 자료입니다.</div>
					<div className="table">
						<table className="tbl_style1 text-center">
							<tbody>
								<tr>
									<th>성명</th>
									<td>
										<input
											type="text"
											id="R_Name"
											name="R_Name"
											maxLength={10}
											className="form-control w100"
											value={infoData.R_Name}
											ref={registerRef("R_Name")}
											onChange={change_infoData}
										/>
									</td>
									<th>직급</th>
									<td>
										<input
											type="text"
											id="R_Position"
											name="R_Position"
											maxLength={10}
											className="form-control w100"
											value={infoData.R_Position}
											ref={registerRef("R_Position")}
											onChange={change_infoData}
										/>
									</td>
								</tr>
								<tr>
									<th>성별</th>
									<td>
										<div style={{ textAlign: "left", padding: "0 10px" }}>
											<label style={{ display: "inline-block", width: "30%" }}>
												<span style={{ verticalAlign: "super" }}>남 : </span>
												<input
													type="radio"
													id="R_Gender"
													name="R_Gender"
													maxLength={10}
													className="form-control"
													value={"M"}
													ref={registerRef("R_Gender")}
													onChange={change_infoData}
												/>
											</label>
											<label style={{ display: "inline-block", width: "30%" }}>
												<span style={{ verticalAlign: "super" }}>여 : </span>
												<input
													type="radio"
													id="R_Gender"
													name="R_Gender"
													maxLength={10}
													className="form-control"
													value={"F"}
													ref={registerRef("R_Gender")}
													onChange={change_infoData}
												/>
											</label>
										</div>
									</td>
									<td></td>
									<td></td>
								</tr>
								<tr>
									<th>사무실 전화번호</th>
									<td className="text-left">
										<input
											type="text"
											id="R_Tel_No"
											name="R_Tel_No"
											title="전화번호"
											className="form-control w100"
											placeholder="00-000-0000"
											maxLength={13}
											value={infoData.R_Tel_No || ""}
											ref={registerRef("R_Tel_No")}
											onChange={(e) => {
												const raw = e.target.value.replace(/\D/g, ""); // 숫자만 남김

												let formatted = raw;

												if (raw.startsWith("02")) {
													// 서울 지역번호는 2자리
													if (raw.length <= 2) {
														formatted = raw;
													} else if (raw.length <= 5) {
														formatted = `${raw.slice(0, 2)}-${raw.slice(2)}`;
													} else if (raw.length <= 9) {
														formatted = `${raw.slice(0, 2)}-${raw.slice(2, 5)}-${raw.slice(5, 9)}`;
													} else {
														formatted = `${raw.slice(0, 2)}-${raw.slice(2, 6)}-${raw.slice(6, 10)}`;
													}
												} else {
													// 기타 지역번호는 보통 3자리
													if (raw.length <= 3) {
														formatted = raw;
													} else if (raw.length <= 6) {
														formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`;
													} else if (raw.length <= 10) {
														formatted = `${raw.slice(0, 3)}-${raw.slice(3, 6)}-${raw.slice(6, 10)}`;
													} else {
														formatted = `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
													}
												}

												e.target.value = formatted;
												change_infoData(e);
											}}
										/>
									</td>
									<th>휴대전화번호</th>
									<td className="text-left">
										<input
											type="text"
											id="R_C_Tel_No"
											name="R_C_Tel_No"
											title="휴대번호"
											placeholder="000-0000-0000"
											className="form-control w100"
											maxLength={13}
											value={infoData.R_C_Tel_No || ""}
											ref={registerRef("R_C_Tel_No")}
											onChange={(e) => {
												const raw = e.target.value.replace(/\D/g, ""); // 숫자만 남김

												let formatted = raw;
												if (raw.length <= 3) {
													formatted = raw;
												} else if (raw.length <= 7) {
													formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`;
												} else {
													formatted = `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
												}

												e.target.value = formatted;
												change_infoData(e);
											}}
										/>
									</td>
								</tr>
								<tr>
									<th>사무실 주소</th>
									<td colSpan={3}>
										<span className="text-left" style={{ textAlign: "left", float: "left", marginBottom: "5px" }}>
											<input
												type="text"
												className="form-control w40"
												id="zonecode"
												name="zonecode"
												maxLength={5}
												value={infoData.zonecode || ""}
												readOnly
												ref={registerRef("zonecode")}
												onClick={(e) => {
													e.preventDefault();
													openPostCode();
												}}
											/>
											<a
												href="#"
												className="btn_post"
												onClick={(e) => {
													e.preventDefault();
													openPostCode();
												}}
											>
												우편번호찾기
											</a>
										</span>
										<input
											type="text"
											name="addr_road"
											className="form-control w100"
											maxLength={150}
											id="addr_road"
											value={infoData.addr_road || ""}
											ref={registerRef("addr_road")}
											readOnly
										/>
										<input
											type="text"
											name="addr_detail"
											className="form-control w100"
											maxLength={100}
											id="addr_detail"
											placeholder="상세주소"
											value={infoData.addr_detail || ""}
											ref={registerRef("addr_detail")}
											onChange={change_infoData}
										/>
									</td>
								</tr>
								<tr>
									<th>이메일 주소</th>
									<td colSpan={3} className="text-left">
										<input
											type="text"
											name="R_Email"
											value={infoData[`R_Email`] || ""}
											className="form-control w80"
											maxLength={45}
											onChange={change_infoData}
											ref={registerRef("R_Email")}
											readOnly
										/>
									</td>
								</tr>
								{/* <tr>
                            <th>담당직원 성명</th>
                            <td colSpan="3" align="left" ><input type="text" className="form-control w80"></td>
                        </tr> */}
							</tbody>
						</table>
					</div>
					<div className="alert mb10 bg-success text-center">※ 통계적 처리를 위한 자료입니다.</div>
					<div className="table" id="R_Div">
						<table className="tbl_style1 text-center checkTable">
							<tbody>
								<tr>
									<th>구분</th>
									<td className="tdw-20">
										대기업
										<br />
										<input
											type="radio"
											id="R_Div1"
											name="R_Div"
											value="1"
											ref={registerRef("R_Div")}
											onChange={change_infoData}
										/>
										<label htmlFor="R_Div1"></label>
									</td>
									<td className="tdw-20">
										중기업
										<br />
										<input type="radio" name="R_Div" value="2" id="R_Div2" onChange={change_infoData} />
										<label htmlFor="R_Div2"></label>
									</td>
									<td className="tdw-20">
										소기업
										<br />
										<input type="radio" name="R_Div" value="3" id="R_Div3" onChange={change_infoData} />
										<label htmlFor="R_Div3"></label>
									</td>
									<td className="tdw-20">
										공공기관
										<br />
										<input
											type="radio"
											name="R_Div"
											value="4"
											id="R_Div4"
											onChange={(e) => {
												if (surveyType.startsWith("hrd_2025")) {
													change_infoData(e, {
														R_Cate: "",
														R_Cate_Name: "",
													});
												} else {
													change_infoData(e);
												}
											}}
										/>
										<label htmlFor="R_Div4"></label>
									</td>
									<td className="tdw-20">
										학교(대학교 등)
										<br />
										<input
											type="radio"
											name="R_Div"
											value="5"
											id="R_Div5"
											onChange={(e) => {
												if (surveyType.startsWith("hrd_2025")) {
													change_infoData(e, {
														R_Cate: "",
														R_Cate_Name: "",
													});
												} else {
													change_infoData(e);
												}
											}}
										/>
										<label htmlFor="R_Div5"></label>
									</td>
								</tr>
								<tr>
									<th>회사(기관)명</th>
									<td colSpan={5} className="text-left">
										<input
											type="text"
											id="R_Company_Name"
											name="R_Company_Name"
											className="form-control w80"
											maxLength={45}
											value={infoData.R_Company_Name || ""}
											ref={registerRef("R_Company_Name")}
											onChange={change_infoData}
										/>
									</td>
								</tr>
								<tr>
									<th>부서(팀)명</th>
									<td colSpan={5} className="text-left">
										<input
											type="text"
											id="R_Part_Name"
											name="R_Part_Name"
											className="form-control w80"
											maxLength={45}
											value={infoData.R_Part_Name || ""}
											ref={registerRef("R_Part_Name")}
											onChange={change_infoData}
										/>
									</td>
								</tr>
								{/* <tr>
                  <th >
                    업종
                    <br />
                    (공공기관, 대학 제외)
                  </th>
                  <td colSpan={5} className="text-left">
                    <p style={{ paddingBottom: "5px" }}>
                      <b>*업종을 직접 기재해주시거나 하단의 구분을 선택해 주십시오.</b>
                    </p>
                    <input type="text" name="R_Cate_Name" className="form-control w80" maxLength={45} />
                  </td>
                </tr> */}
								{surveyType.includes("hrd_2024") && (
									<>
										<tr id="R_Cate">
											<th rowSpan={2}>
												업종
												<br />
												(공공기관, 대학 제외)
											</th>
											<td>
												제조
												<br />
												<input
													type="radio"
													id="R_Cate1"
													name="R_Cate"
													value="1"
													ref={registerRef("R_Cate")}
													onChange={(e) =>
														change_infoData(e, {
															R_Cate_Name: "",
														})
													}
												/>
												<label htmlFor="R_Cate1"></label>
											</td>
											<td>
												서비스
												<br />
												<input
													type="radio"
													id="R_Cate2"
													name="R_Cate"
													value="2"
													onChange={(e) =>
														change_infoData(e, {
															R_Cate_Name: "",
														})
													}
												/>
												<label htmlFor="R_Cate2"></label>
											</td>
											<td>
												유통/판매
												<br />
												<input
													type="radio"
													id="R_Cate3"
													name="R_Cate"
													value="3"
													onChange={(e) =>
														change_infoData(e, {
															R_Cate_Name: "",
														})
													}
												/>
												<label htmlFor="R_Cate3"></label>
											</td>
											<td>
												금융/보험
												<br />
												<input
													type="radio"
													id="R_Cate4"
													name="R_Cate"
													value="4"
													onChange={(e) =>
														change_infoData(e, {
															R_Cate_Name: "",
														})
													}
												/>
												<label htmlFor="R_Cate4"></label>
											</td>
											<td>
												건설
												<br />
												<input
													type="radio"
													id="R_Cate5"
													name="R_Cate"
													value="5"
													onChange={(e) =>
														change_infoData(e, {
															R_Cate_Name: "",
														})
													}
												/>
												<label htmlFor="R_Cate5"></label>
											</td>
										</tr>
										<tr>
											<td>
												연구개발
												<br />
												<input
													type="radio"
													id="R_Cate6"
													name="R_Cate"
													value="6"
													onChange={(e) =>
														change_infoData(e, {
															R_Cate_Name: "",
														})
													}
												/>
												<label htmlFor="R_Cate6"></label>
											</td>
											<td>
												정보통신
												<br />
												<input
													type="radio"
													id="R_Cate7"
													name="R_Cate"
													value="7"
													onChange={(e) =>
														change_infoData(e, {
															R_Cate_Name: "",
														})
													}
												/>
												<label htmlFor="R_Cate7"></label>
											</td>
											<td>
												병원
												<br />
												<input
													type="radio"
													id="R_Cate8"
													name="R_Cate"
													value="8"
													onChange={(e) =>
														change_infoData(e, {
															R_Cate_Name: "",
														})
													}
												/>
												<label htmlFor="R_Cate8"></label>
											</td>
											<td colSpan={2}>
												<div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
													기타{" "}
													<input
														type="text"
														id="R_Cate_Name"
														className="form-control w80"
														name="R_Cate_Name"
														value={infoData.R_Cate_Name || ""}
														ref={registerRef("R_Cate_Name")}
														onChange={change_infoData}
														readOnly={infoData.R_Cate ? infoData.R_Cate != "etc" : true}
													/>
												</div>
												<input type="radio" id="R_Cate9" name="R_Cate" value="etc" onChange={change_infoData} />
												<label htmlFor="R_Cate9"></label>
											</td>
										</tr>
									</>
								)}
								{surveyType.includes("hrm_2024") && (
									<>
										<tr>
											<th rowSpan={4}>
												업종
												<br />
											</th>
											<td colSpan={5} className="text-left">
												<p style={{ paddingBottom: "5px" }}>
													<b>*업종을 직접 기재해주시거나 하단의 구분을 선택해 주십시오.</b>
												</p>
											</td>
										</tr>
										<tr id="R_Cate">
											<td>
												공공부문
												<br />
												<input
													type="radio"
													id="R_Cate1"
													name="R_Cate"
													value="1"
													ref={registerRef("R_Cate")}
													onChange={(e) =>
														change_infoData(e, {
															R_Cate_Name: "",
														})
													}
												/>
												<label htmlFor="R_Cate1"></label>
											</td>
											<td>
												전자/반도체/통신
												<br />
												<input
													type="radio"
													id="R_Cate2"
													name="R_Cate"
													value="2"
													onChange={(e) =>
														change_infoData(e, {
															R_Cate_Name: "",
														})
													}
												/>
												<label htmlFor="R_Cate2"></label>
											</td>
											<td>
												건설
												<br />
												<input
													type="radio"
													id="R_Cate3"
													name="R_Cate"
													value="3"
													onChange={(e) =>
														change_infoData(e, {
															R_Cate_Name: "",
														})
													}
												/>
												<label htmlFor="R_Cate3"></label>
											</td>
											<td>
												자동차/철강
												<br />
												<input
													type="radio"
													id="R_Cate4"
													name="R_Cate"
													value="4"
													onChange={(e) =>
														change_infoData(e, {
															R_Cate_Name: "",
														})
													}
												/>
												<label htmlFor="R_Cate4"></label>
											</td>
											<td>
												항공/철도/조선
												<br />
												<input
													type="radio"
													id="R_Cate5"
													name="R_Cate"
													value="5"
													onChange={(e) =>
														change_infoData(e, {
															R_Cate_Name: "",
														})
													}
												/>
												<label htmlFor="R_Cate5"></label>
											</td>
										</tr>
										<tr>
											<td>
												에너지/환경/화학
												<br />
												<input
													type="radio"
													id="R_Cate6"
													name="R_Cate"
													value="6"
													onChange={(e) =>
														change_infoData(e, {
															R_Cate_Name: "",
														})
													}
												/>
												<label htmlFor="R_Cate6"></label>
											</td>
											<td>
												패션/유통/식품
												<br />
												<input
													type="radio"
													id="R_Cate7"
													name="R_Cate"
													value="7"
													onChange={(e) =>
														change_infoData(e, {
															R_Cate_Name: "",
														})
													}
												/>
												<label htmlFor="R_Cate7"></label>
											</td>
											<td>
												의료/제약/바이오
												<br />
												<input
													type="radio"
													id="R_Cate8"
													name="R_Cate"
													value="8"
													onChange={(e) =>
														change_infoData(e, {
															R_Cate_Name: "",
														})
													}
												/>
												<label htmlFor="R_Cate8"></label>
											</td>
											<td>
												금융/은행/보험
												<br />
												<input
													type="radio"
													id="R_Cate9"
													name="R_Cate"
													value="9"
													onChange={(e) =>
														change_infoData(e, {
															R_Cate_Name: "",
														})
													}
												/>
												<label htmlFor="R_Cate9"></label>
											</td>
											<td>
												IT/Software
												<br />
												<input
													type="radio"
													id="R_Cate10"
													name="R_Cate"
													value="10"
													onChange={(e) =>
														change_infoData(e, {
															R_Cate_Name: "",
														})
													}
												/>
												<label htmlFor="R_Cate10"></label>
											</td>
										</tr>
										<tr>
											<td>
												교육/연구
												<br />
												<input
													type="radio"
													id="R_Cate11"
													name="R_Cate"
													value="11"
													onChange={(e) =>
														change_infoData(e, {
															R_Cate_Name: "",
														})
													}
												/>
												<label htmlFor="R_Cate11"></label>
											</td>
											<td>
												여행/관광/레저
												<br />
												<input
													type="radio"
													id="R_Cate12"
													name="R_Cate"
													value="12"
													onChange={(e) =>
														change_infoData(e, {
															R_Cate_Name: "",
														})
													}
												/>
												<label htmlFor="R_Cate12"></label>
											</td>
											<td>
												일반 서비스
												<br />
												<input
													type="radio"
													id="R_Cate13"
													name="R_Cate"
													value="13"
													onChange={(e) =>
														change_infoData(e, {
															R_Cate_Name: "",
														})
													}
												/>
												<label htmlFor="R_Cate13"></label>
											</td>
											<td colSpan={4}>
												기타{" "}
												<input
													type="text"
													id="R_Cate_Name"
													name="R_Cate_Name"
													className="form-control w80"
													maxLength={45}
													value={infoData.R_Cate_Name || ""}
													ref={registerRef("R_Cate_Name")}
													onChange={change_infoData}
													readOnly={infoData.R_Cate ? infoData.R_Cate != "etc" : true}
												/>
												<br />
												<input type="radio" id="R_Cate14" name="R_Cate" value="etc" onChange={change_infoData} />
												<label htmlFor="R_Cate14"></label>
											</td>
										</tr>
									</>
								)}
								{surveyType.includes("hrm_2025") && (
									<>
										<tr>
											<th rowSpan={4}>업종</th>
											<td colSpan={5} className="text-left">
												<p style={{ paddingBottom: "5px" }}>
													<b>*업종을 직접 기재해주시거나 하단의 구분을 선택해 주십시오.</b>
												</p>
											</td>
										</tr>
										<tr id="R_Cate">
											<td>
												전자/반도체/통신
												<br />
												<input
													type="radio"
													id="R_Cate1"
													name="R_Cate"
													value="1"
													ref={registerRef("R_Cate")}
													onChange={(e) =>
														change_infoData(e, {
															R_Cate_Name: "",
														})
													}
													checked={infoData.R_Cate == "1"}
												/>
												<label htmlFor="R_Cate1"></label>
											</td>
											<td>
												건설
												<br />
												<input
													type="radio"
													id="R_Cate2"
													name="R_Cate"
													value="2"
													onChange={(e) =>
														change_infoData(e, {
															R_Cate_Name: "",
														})
													}
													checked={infoData.R_Cate == "2"}
												/>
												<label htmlFor="R_Cate2"></label>
											</td>
											<td>
												자동차/철강
												<br />
												<input
													type="radio"
													id="R_Cate3"
													name="R_Cate"
													value="3"
													onChange={(e) =>
														change_infoData(e, {
															R_Cate_Name: "",
														})
													}
													checked={infoData.R_Cate == "3"}
												/>
												<label htmlFor="R_Cate3"></label>
											</td>
											<td>
												항공/철도/조선
												<br />
												<input
													type="radio"
													id="R_Cate4"
													name="R_Cate"
													value="4"
													onChange={(e) =>
														change_infoData(e, {
															R_Cate_Name: "",
														})
													}
													checked={infoData.R_Cate == "4"}
												/>
												<label htmlFor="R_Cate4"></label>
											</td>
											<td>
												에너지/환경/화학
												<br />
												<input
													type="radio"
													id="R_Cate5"
													name="R_Cate"
													value="5"
													onChange={(e) =>
														change_infoData(e, {
															R_Cate_Name: "",
														})
													}
													checked={infoData.R_Cate == "5"}
												/>
												<label htmlFor="R_Cate5"></label>
											</td>
										</tr>
										<tr>
											<td>
												패션/유통/식품
												<br />
												<input
													type="radio"
													id="R_Cate6"
													name="R_Cate"
													value="6"
													onChange={(e) =>
														change_infoData(e, {
															R_Cate_Name: "",
														})
													}
													checked={infoData.R_Cate == "6"}
												/>
												<label htmlFor="R_Cate6"></label>
											</td>
											<td>
												의료/제약/바이오
												<br />
												<input
													type="radio"
													id="R_Cate7"
													name="R_Cate"
													value="7"
													onChange={(e) =>
														change_infoData(e, {
															R_Cate_Name: "",
														})
													}
													checked={infoData.R_Cate == "7"}
												/>
												<label htmlFor="R_Cate7"></label>
											</td>
											<td>
												금융/은행/보험
												<br />
												<input
													type="radio"
													id="R_Cate8"
													name="R_Cate"
													value="8"
													onChange={(e) =>
														change_infoData(e, {
															R_Cate_Name: "",
														})
													}
													checked={infoData.R_Cate == "8"}
												/>
												<label htmlFor="R_Cate8"></label>
											</td>
											<td>
												IT/Software
												<br />
												<input
													type="radio"
													id="R_Cate9"
													name="R_Cate"
													value="9"
													onChange={(e) =>
														change_infoData(e, {
															R_Cate_Name: "",
														})
													}
													checked={infoData.R_Cate == "9"}
												/>
												<label htmlFor="R_Cate9"></label>
											</td>
											<td>
												교육/연구
												<br />
												<input
													type="radio"
													id="R_Cate10"
													name="R_Cate"
													value="10"
													onChange={(e) =>
														change_infoData(e, {
															R_Cate_Name: "",
														})
													}
													checked={infoData.R_Cate == "10"}
												/>
												<label htmlFor="R_Cate10"></label>
											</td>
										</tr>
										<tr>
											<td>
												여행/관광/레저
												<br />
												<input
													type="radio"
													id="R_Cate11"
													name="R_Cate"
													value="11"
													onChange={(e) =>
														change_infoData(e, {
															R_Cate_Name: "",
														})
													}
													checked={infoData.R_Cate == "11"}
												/>
												<label htmlFor="R_Cate11"></label>
											</td>
											<td>
												아동/청소년/복지
												<br />
												<input
													type="radio"
													id="R_Cate12"
													name="R_Cate"
													value="12"
													onChange={(e) =>
														change_infoData(e, {
															R_Cate_Name: "",
														})
													}
													checked={infoData.R_Cate == "12"}
												/>
												<label htmlFor="R_Cate12"></label>
											</td>
											<td>
												일반 서비스
												<br />
												<input
													type="radio"
													id="R_Cate13"
													name="R_Cate"
													value="13"
													onChange={(e) =>
														change_infoData(e, {
															R_Cate_Name: "",
														})
													}
													checked={infoData.R_Cate == "13"}
												/>
												<label htmlFor="R_Cate13"></label>
											</td>
											<td colSpan={4}>
												기타{" "}
												<input
													type="text"
													id="R_Cate_Name"
													name="R_Cate_Name"
													className="form-control w80"
													maxLength={45}
													value={infoData.R_Cate_Name || ""}
													ref={registerRef("R_Cate_Name")}
													onChange={change_infoData}
													readOnly={infoData.R_Cate ? infoData.R_Cate != "etc" : true}
												/>
												<br />
												<input
													type="radio"
													id="R_Cate14"
													name="R_Cate"
													value="etc"
													onChange={change_infoData}
													checked={infoData.R_Cate == "etc"}
												/>
												<label htmlFor="R_Cate14"></label>
											</td>
										</tr>
									</>
								)}
								{surveyType.includes("hrd_2025") && (
									<>
										<tr>
											<th rowSpan={4}>업종</th>
											<td colSpan={5} className="text-left">
												<p style={{ paddingBottom: "5px" }}>
													<b>*업종을 직접 기재해주시거나 하단의 구분을 선택해 주십시오.</b>
												</p>
											</td>
										</tr>
										<tr id="R_Cate">
											<td>
												전자/반도체/통신
												<br />
												<input
													type="radio"
													id="R_Cate1"
													name="R_Cate"
													value="1"
													ref={registerRef("R_Cate")}
													onChange={(e) =>
														change_infoData(e, {
															R_Cate_Name: "",
														})
													}
													checked={infoData.R_Cate == "1"}
													disabled={["4", "5"].includes(String(infoData.R_Div))}
												/>
												<label htmlFor="R_Cate1"></label>
											</td>
											<td>
												건설
												<br />
												<input
													type="radio"
													id="R_Cate2"
													name="R_Cate"
													value="2"
													onChange={(e) =>
														change_infoData(e, {
															R_Cate_Name: "",
														})
													}
													checked={infoData.R_Cate == "2"}
													disabled={["4", "5"].includes(String(infoData.R_Div))}
												/>
												<label htmlFor="R_Cate2"></label>
											</td>
											<td>
												자동차/철강
												<br />
												<input
													type="radio"
													id="R_Cate3"
													name="R_Cate"
													value="3"
													onChange={(e) =>
														change_infoData(e, {
															R_Cate_Name: "",
														})
													}
													checked={infoData.R_Cate == "3"}
													disabled={["4", "5"].includes(String(infoData.R_Div))}
												/>
												<label htmlFor="R_Cate3"></label>
											</td>
											<td>
												항공/철도/조선
												<br />
												<input
													type="radio"
													id="R_Cate4"
													name="R_Cate"
													value="4"
													onChange={(e) =>
														change_infoData(e, {
															R_Cate_Name: "",
														})
													}
													checked={infoData.R_Cate == "4"}
													disabled={["4", "5"].includes(String(infoData.R_Div))}
												/>
												<label htmlFor="R_Cate4"></label>
											</td>
											<td>
												에너지/환경/화학
												<br />
												<input
													type="radio"
													id="R_Cate5"
													name="R_Cate"
													value="5"
													onChange={(e) =>
														change_infoData(e, {
															R_Cate_Name: "",
														})
													}
													checked={infoData.R_Cate == "5"}
													disabled={["4", "5"].includes(String(infoData.R_Div))}
												/>
												<label htmlFor="R_Cate5"></label>
											</td>
										</tr>
										<tr>
											<td>
												패션/유통/식품
												<br />
												<input
													type="radio"
													id="R_Cate6"
													name="R_Cate"
													value="6"
													onChange={(e) =>
														change_infoData(e, {
															R_Cate_Name: "",
														})
													}
													checked={infoData.R_Cate == "6"}
													disabled={["4", "5"].includes(String(infoData.R_Div))}
												/>
												<label htmlFor="R_Cate6"></label>
											</td>
											<td>
												의료/제약/바이오
												<br />
												<input
													type="radio"
													id="R_Cate7"
													name="R_Cate"
													value="7"
													onChange={(e) =>
														change_infoData(e, {
															R_Cate_Name: "",
														})
													}
													checked={infoData.R_Cate == "7"}
													disabled={["4", "5"].includes(String(infoData.R_Div))}
												/>
												<label htmlFor="R_Cate7"></label>
											</td>
											<td>
												금융/은행/보험
												<br />
												<input
													type="radio"
													id="R_Cate8"
													name="R_Cate"
													value="8"
													onChange={(e) =>
														change_infoData(e, {
															R_Cate_Name: "",
														})
													}
													checked={infoData.R_Cate == "8"}
													disabled={["4", "5"].includes(String(infoData.R_Div))}
												/>
												<label htmlFor="R_Cate8"></label>
											</td>
											<td>
												IT/Software
												<br />
												<input
													type="radio"
													id="R_Cate9"
													name="R_Cate"
													value="9"
													onChange={(e) =>
														change_infoData(e, {
															R_Cate_Name: "",
														})
													}
													checked={infoData.R_Cate == "9"}
													disabled={["4", "5"].includes(String(infoData.R_Div))}
												/>
												<label htmlFor="R_Cate9"></label>
											</td>
											<td>
												교육/연구
												<br />
												<input
													type="radio"
													id="R_Cate10"
													name="R_Cate"
													value="10"
													onChange={(e) =>
														change_infoData(e, {
															R_Cate_Name: "",
														})
													}
													checked={infoData.R_Cate == "10"}
													disabled={["4", "5"].includes(String(infoData.R_Div))}
												/>
												<label htmlFor="R_Cate10"></label>
											</td>
										</tr>
										<tr>
											<td>
												여행/관광/레저
												<br />
												<input
													type="radio"
													id="R_Cate11"
													name="R_Cate"
													value="11"
													onChange={(e) =>
														change_infoData(e, {
															R_Cate_Name: "",
														})
													}
													checked={infoData.R_Cate == "11"}
													disabled={["4", "5"].includes(String(infoData.R_Div))}
												/>
												<label htmlFor="R_Cate11"></label>
											</td>
											<td>
												아동/청소년/복지
												<br />
												<input
													type="radio"
													id="R_Cate12"
													name="R_Cate"
													value="12"
													onChange={(e) =>
														change_infoData(e, {
															R_Cate_Name: "",
														})
													}
													checked={infoData.R_Cate == "12"}
													disabled={["4", "5"].includes(String(infoData.R_Div))}
												/>
												<label htmlFor="R_Cate12"></label>
											</td>
											<td>
												일반 서비스
												<br />
												<input
													type="radio"
													id="R_Cate13"
													name="R_Cate"
													value="13"
													onChange={(e) =>
														change_infoData(e, {
															R_Cate_Name: "",
														})
													}
													checked={infoData.R_Cate == "13"}
													disabled={["4", "5"].includes(String(infoData.R_Div))}
												/>
												<label htmlFor="R_Cate13"></label>
											</td>
											<td colSpan={4}>
												기타{" "}
												<input
													type="text"
													id="R_Cate_Name"
													name="R_Cate_Name"
													className="form-control w80"
													maxLength={45}
													value={infoData.R_Cate_Name || ""}
													ref={registerRef("R_Cate_Name")}
													onChange={change_infoData}
													readOnly={
														infoData.R_Cate && !["4", "5"].includes(String(infoData.R_Div))
															? infoData.R_Cate != "etc"
															: true
													}
												/>
												<br />
												<input
													type="radio"
													id="R_Cate14"
													name="R_Cate"
													value="etc"
													onChange={change_infoData}
													checked={infoData.R_Cate == "etc"}
													disabled={["4", "5"].includes(String(infoData.R_Div))}
												/>
												<label htmlFor="R_Cate14"></label>
											</td>
										</tr>
									</>
								)}
								<tr>
									<th>사업자등록번호</th>
									<td colSpan={5} className="text-left">
										<input
											type="text"
											id="R_Biz_Reg_No"
											name="R_Biz_Reg_No"
											className="form-control w80"
											placeholder="000-00-00000"
											maxLength={12}
											title="사업자등록번호"
											value={infoData.R_Biz_Reg_No || ""}
											ref={registerRef("R_Biz_Reg_No")}
											onChange={change_infoData}
										/>{" "}
									</td>
								</tr>
								{surveyType.includes("hrm") && (
									<>
										<tr>
											<th>매출 총액</th>
											<td colSpan={5} className="text-left">
												<input
													type="text"
													id="R_COMMON_1_1"
													name="R_COMMON_1_1"
													className="form-control w80"
													maxLength={21}
													value={infoData.R_COMMON_1_1 || ""}
													ref={registerRef("R_COMMON_1_1")}
													onChange={change_infoData}
												/>{" "}
												원
												<p className="alert bg-danger">
													* ‘매출 총액’의 경우 매출이 없는 공공기관은 기입하지 않으셔도 됩니다.
												</p>
											</td>
										</tr>
										<tr>
											<th>전체 직원 수</th>
											<td colSpan={5} className="text-left">
												<input
													type="text"
													id="R_COMMON_1_2"
													name="R_COMMON_1_2"
													className="form-control w80"
													maxLength={21}
													value={infoData.R_COMMON_1_2 || ""}
													ref={registerRef("R_COMMON_1_2")}
													onChange={change_infoData}
												/>{" "}
												명
											</td>
										</tr>
									</>
								)}
								<tr>
									<th>
										설문 요청 엑스퍼트 직원 이름
										<br />
										(해당경우에만 기입)
									</th>
									<td colSpan={5} className="text-left">
										<input
											type=""
											name="recommend"
											className="form-control w80"
											maxLength={20}
											title=""
											value={infoData.recommend || ""}
											ref={registerRef("recommend")}
											onChange={change_infoData}
										/>
										※귀하에게 실태조사를 요청한 엑스퍼트컨설팅 직원이 없으면 기입하지 않아도 됩니다.
									</td>
								</tr>
							</tbody>
						</table>
					</div>

					<div>
						<div>
							<div className="form-check flex-center" style={{ paddingRight: "0px" }}>
								<input
									className="form-check-input"
									type="checkbox"
									name="agree"
									id="okchk"
									checked={agree}
									ref={registerRef("agree")}
									onChange={() => set_agree(!agree)}
								/>
								<label className="form-check-label" htmlFor="okchk">
									개인정보 수집,이용 동의
								</label>
								<button
									type="button"
									className={`btn btn-${okchk ? "danger" : "primary"} btn-sm`}
									id="btnView"
									onClick={() => {
										set_okchk(!okchk);
									}}
								>
									{okchk ? "닫기" : "보기"}
								</button>
							</div>
						</div>
						<div style={{ marginTop: "10px", display: okchk ? "block" : "none" }} id="form">
							<textarea
								className="form-control"
								style={{ backgroundColor: "#fff" }}
								value={`■ 개인정보 수집목적 및 이용목적
교육 세미나 접수에 따른 신청 및 취소에 관한 확인 및 관리, 정보 및 콘텐츠 제공을 위한 이메일 및 우편물 발송

■ 수집하는 개인정보 항목
성명, 직급, 사무실 주소, 휴대전화번호, 이메일주소, 회사(기관)명, 부서(팀)명

■ 개인정보의 보유 및 이용기간
신청자의 개인정보는 추후 이력관리 및 원활한 서비스 지원을 위해 계속 보유합니다. 다만 이용자가 메일/전화 등을 통해 정보삭제를 요청한 경우 수집된 개인정보는 재생할 수 없는 방법에 의하여 하드디스크에서 완전히 삭제되며 어떠한 용도로도 열람 또는 이용할 수 없도록 처리됩니다. 서비스 이용 과정에서 단말기정보, IP주소, 쿠키 등의 정보가 자동으로 생성되어 수집될 수 있습니다.`}
								readOnly
							></textarea>
						</div>
					</div>
					<div className="text-center" style={{ paddingTop: "10px" }}>
						<button type="submit" className="btn-primary btn btn-lg">
							설문시작
						</button>
					</div>
				</div>
				<Survey_footer surveyYear={surveyYear} />
			</div>
		</form>
	);
}
