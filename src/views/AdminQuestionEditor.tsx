/* 관리자 설문 문항 설정 */
import { useNavigate, useParams, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import AdminMultiTable from "../components/admin/AdminMultiTable.js";
import AdminMultiChoice from "../components/admin/AdminMultiChoice.js";
import AdminEtcText from "../components/admin/AdminEtcText.js";
import AdminEtcTextarea from "../components/admin/AdminEtcTextarea.js";
import MultiTable from "../components/questionType/MultiTable.jsx";
import MultiChoice from "../components/questionType/MultiChoice.jsx";
import EtcText from "../components/questionType/EtcText.jsx";
import EtcTextarea from "../components/questionType/EtcTextarea.jsx";
// import { adminGetSurveyInfo, adminSetSurveyInfo } from "../compositions/admin.js";
// import AdminMultiTableExcel from "../components/admin/AdminMultiTableExcel.js";
import AllLoding from "../components/AllLoding.js";
import { copyText } from "../lib/ui.js";
import {
	EtcTextareaQuestion,
	EtcTextQuestion,
	MultiChoiceQuestion,
	MultiTableQuestion,
	Munhang,
	Question,
	RequiredHideRule,
	ResultData,
} from "../types/survey.js";
import { useAppDispatch } from "../hooks/useRedux.js";
import { useAdminSetSurveyQuestion } from "../hooks/admin/useAdminSetSurveyQuestion.js";
import { useAdminSurveyQuestion } from "../hooks/admin/useAdminSurveyQuestion.js";
import { useAdminSurveyTableMake } from "../hooks/admin/useAdminSurveyTableMake.js";

export default function AdminQuestionEditor() {
	const { surveyType, surveyPage } = useParams() as { surveyType: string; surveyPage: string };
	const surveyPageNum = Number(surveyPage);
	let urlType = "";
	let sYear = "";
	if (surveyType) {
		urlType = surveyType.split("_")[0];
		sYear = surveyType.split("_")[1];
	}
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { mutate: setQuestion } = useAdminSetSurveyQuestion();
	const { isSuccess, data: questionData, isError, error } = useAdminSurveyQuestion(surveyType, surveyPage);
	const { mutate: surveyTableMake } = useAdminSurveyTableMake();

	let R_num = 0;
	// 로딩
	const [loding, set_loding] = useState(false);

	// 가장 위 메뉴
	const [top_menuList, set_top_menuList] = useState<string[]>([]); //
	const [munhangs, set_munhangs] = useState<Munhang[]>([]); // 질문문항들
	const [resultData] = useState<ResultData>({}); // 결과데이터(관리자에선 쓰진않음)
	const [initData, set_initData] = useState<ResultData>({}); // 초기데이터 문항만들면 자동으로 만들어짐

	// required 설정
	const [requiredOn, set_requiredOn] = useState<boolean>(false);
	const [requiredList, set_requiredList] = useState<RequiredHideRule[]>([]);
	// 테이블에 저장된 데이터가 있는지
	const [hasTableData, set_hasTableData] = useState<boolean>(false);

	// 결과데이터 바꾸기
	const changeResultData = () => {
		dispatch({ type: "modal/on_modal_alert", payload: `관리자에선 결과 작동이 안됨` });
	};
	// 문항 바꾸기
	const changeSubcontents = (R_num: number, subContents: Question["subContents"]) => {
		set_munhangs((prev) => {
			let rIdx = 0;
			const newMunhangs = [...prev];
			newMunhangs.map((newMunhang) => {
				newMunhang.questions.map((question) => {
					rIdx++;
					if (rIdx == R_num) {
						question.subContents = subContents;
					}
				});
			});
			return [...newMunhangs];
		});
	};
	// 초기데이터 제작
	const change_initData = () => {
		let obj = {};
		let rIdx = 0;
		munhangs.forEach((munhang) => {
			munhang.questions.forEach((question) => {
				rIdx++;
				obj = {
					...obj,
					...initData_make(rIdx, question.qType, question.subContents),
				};
			});
		});
		set_initData(obj);
		return obj;
	};
	// 초기데이터 만들기!!
	const initData_make = (rNum: number, qType: Question["qType"], subCont: Question["subContents"]) => {
		const arr = [];
		if (qType === "MultiTable") {
			const sc = subCont as MultiTableQuestion["subContents"];
			if (sc.table_th instanceof Array) {
				sc.table_th.map((th, thIdx) => {
					if (th === "R_etc") arr.push(`R_${rNum}_th_${thIdx + 1}_etc`);
				});
			}
			sc.table_td.map((tr: string[], trIdx: number) => {
				tr.map((td, tdIdx) => {
					if (
						td === "R_per" ||
						td === "R_wei" ||
						td === "R_people" ||
						td === "R_year" ||
						td === "R_won" ||
						td === "R_time" ||
						td === "R_term"
					) {
						arr.push(`R_${rNum}_${trIdx + 1}_${tdIdx + 1}`);
					} else if (td === "R_check") {
						const tableSubCont = subCont as MultiTableQuestion["subContents"];
						arr.push(`R_${rNum}_n_${tdIdx + 1}_che`);
						if (tableSubCont.checkType == 3) {
							arr.push(`R_${rNum}_cheOrder`);
						}
					} else if (td === "R_relCheck") {
						arr.push(`R_${rNum}_n_${tdIdx + 1}_f`);
						arr.push(`R_${rNum}_n_${tdIdx + 1}_b`);
					} else if (td === "R_relWeight") {
						arr.push(`R_${rNum}_n_${tdIdx + 1}_fWei`);
						arr.push(`R_${rNum}_${trIdx + 1}_${tdIdx + 1}_bWei`);
					} else if (td === "R_radio") {
						arr.push(`R_${rNum}_n_${tdIdx + 1}_rad`);
					} else if (td === "R_increDecre") {
						arr.push(`R_${rNum}_n_${tdIdx + 1}`);
					} else if (td === "R_increDecre2") {
						arr.push(`R_${rNum}_n_${tdIdx + 1}`);
					} else if (td === "R_etc") {
						arr.push(`R_${rNum}_${trIdx + 1}_etc`);
					}
				});
			});
		} else if (qType === "MultiChoice") {
			const sc = subCont as MultiChoiceQuestion["subContents"];
			arr.push(`R_${rNum}_multi`);
			sc.choices?.map((v) => {
				if (v.content === "R_etc") arr.push(`R_${rNum}_etc`);
			});
		} else if (qType === "EtcText") {
			arr.push(`R_${rNum}_etc`);
		} else if (qType === "EtcTextarea") {
			arr.push(`R_${rNum}_etc`);
		}
		const obj: Record<string, string> = {};
		arr.map((v) => {
			obj[v] = "";
		});
		return obj;
	};

	// required 검사
	const required_checked = () => {
		for (const required of requiredList) {
			if (!required.attr) {
				required_alert();
				return false;
			}
			if (required.values.some((v) => !v)) {
				required_alert();
				return false;
			}
			if (required.hide.some((v) => !v)) {
				required_alert();
				return false;
			}
		}
		function required_alert() {
			dispatch({ type: "modal/on_modal_alert", payload: "required 설정을 채워주세요." });
		}
		return true;
	};
	// 설문정보 저장하기
	const store_surveyInfo = () => {
		if (!required_checked()) return false;
		let emptyIndex = -1;
		if (
			top_menuList.some((v, i) => {
				if (!v) emptyIndex = i;
				return !v;
			})
		) {
			dispatch({ type: "modal/on_modal_alert", payload: "모든 헤더메뉴 이름을 채워주세요." });
			document.getElementById(`top_menu_${emptyIndex}`)?.focus();
		} else {
			const newInitData = change_initData();

			const param_obj = {
				surveyType,
				surveyPage,
				top_menuList,
				head_title: top_menuList[surveyPageNum - 1],
				requiredList,
				munhangs,
				initData: newInitData,
			};
			setQuestion(param_obj, {
				onSuccess(data) {
					if (data.code === 200) dispatch({ type: "modal/on_modal_alert", payload: "저장 완료" });
					else {
						dispatch({ type: "modal/on_modal_alert", payload: "오류 발생" });
					}
				},
			});
		}
		return true;
	};
	// 결과 테이블 만들기
	const create_resultTable = () => {
		if (hasTableData) {
			alert("테이블에 저장된 데이터가 있습니다.\n데이터 백업 및 초기화 후 진행해주세요.");
			return;
		}
		console.log(initData);
		if (confirm("결과 테이블을 만드시겠습니까?")) {
			set_loding(true);
			surveyTableMake(
				{ surveyType, surveyPage, initData },
				{
					onSuccess(data) {
						console.log(data);
					},
					onSettled() {
						console.log(123);
						set_loding(false);
					},
				}
			);
		}
	};

	const init = async () => {
		set_loding(true);
		console.log(surveyType, surveyPage);
		if (isSuccess) {
			// code =
			// 4033 : 처음들어왔을 때
			// 4034 :
			// 4035 : 아예없음
			const data = questionData;
			console.log(data);
			if (data.code === 200) {
				set_initData({
					...data.data.initData,
				});
				set_munhangs([...data.data.munhangs]);
				set_top_menuList([...data.data.top_menuList]);
				if (data.data.requiredList) set_requiredList([...data.data.requiredList]);
				if (data.data.survey_answer_is_record) set_hasTableData(true);
			} else if (data.code === 4033 || data.code === 4034) {
				set_munhangs([
					{
						title: "기본",
						questions: [
							{
								//   title: "귀사(기관)에서 실시한 교육 형태별 참가인원 비율을 기술해 주십시오.<br>(항목별 가로 합이 100%가 되도록 기술)",
								title: "",
								subContents: {},
							},
						],
					},
				]);
				if (surveyPageNum == 1) set_top_menuList(["기본"]);
			} else if (data.code === 4035) {
				dispatch({ type: "modal/on_modal_alert", payload: "문항 정보가 존재하지 않습니다." });
				navigate(-1);
			} else {
				alert("?????????????");
				console.log("?????????????");
			}
		} else if (isError) {
			console.log(error);
			dispatch({ type: "modal/on_modal_alert", payload: "잘못된 접근입니다." });
			navigate(`/admin/main/${surveyType.substring(surveyType.length - 4, surveyType.length)}`, { replace: true });
		}
		set_loding(false);
	};

	useEffect(() => {
		init();
		return () => {};
	}, [location.pathname, isSuccess, questionData]);

	if (loding) return <AllLoding />;

	return (
		<div id="adminSurveyHome">
			<div>
				<div className={`align_center admin-file`} style={{ height: "194px" }}>
					<img src={`https://research.exc.co.kr/RAC/${sYear}_img/${urlType}_maintop.png?v=${new Date().getTime()}`} alt="사진1 사진없음" />
				</div>
				<header className="top_menu">
					{top_menuList.map((cont, index) => (
						<a
							key={"top_menu" + index}
							className={surveyPage == String(index + 1) ? "-active" : ""}
							onClick={(e) => {
								e.preventDefault();
							}}
						>
							<input
								type="text"
								id={"top_menu_" + index}
								className="smooth-input"
								value={cont}
								onChange={(e) => {
									top_menuList[index] = e.target.value;
									set_top_menuList([...top_menuList]);
								}}
							/>
							{surveyPage != String(index + 1) && (
								<button
									className="btn btn-lg btn-warning"
									onClick={() => {
										if (store_surveyInfo()) navigate(`/admin/${surveyType}/${index + 1}`);
									}}
								>
									이동
								</button>
							)}

							{index > 0 && (
								<button
									className="topmenu-delete btn btn-lg btn-danger"
									onClick={() => {
										top_menuList.splice(index, 1);
										set_top_menuList([...top_menuList]);
									}}
								>
									-
								</button>
							)}
						</a>
					))}
					<a
						href="#"
						key={"top_menu"}
						onClick={(e) => {
							e.preventDefault();
							top_menuList.push("");
							set_top_menuList([...top_menuList]);
						}}
					>
						+
					</a>
				</header>
				<form
					name="form"
					method="post"
					onSubmit={(e) => {
						e.preventDefault();
					}}
				>
					<div className="page" style={{ width: "1400px" }}>
						<div>
							{requiredOn ? (
								<>
									<button className="btn btn-warning" onClick={() => set_requiredOn(false)}>
										required 설정 닫기
									</button>

									<div>
										<h3>- required 설정</h3>
										<p className="c_red">* 문항 건너띄기 설정, 개발자 아닐 시 건들지 않기</p>
										<div>
											{requiredList.map((required, rIdx, rArr) => {
												return (
													<div
														key={"required" + rIdx}
														style={{
															backgroundColor: "rgba(242, 203, 97, 0.2)",
															borderBottom: "2px solid #aaa",
														}}
													>
														<button
															className="btn btn-danger"
															onClick={() => {
																rArr.splice(rIdx, 1);
																set_requiredList([...requiredList]);
															}}
														>
															삭제
														</button>
														어떤 속성이 :{" "}
														<select
															className="form-control"
															value={required.attr}
															onChange={(e) => {
																if (e.target.value) {
																	required.attr = e.target.value;
																	set_requiredList([...requiredList]);
																}
															}}
														>
															<option value=""></option>
															{Object.keys(initData).map((v, i) => (
																<option key={"rNum" + i} value={v}>
																	{v}
																</option>
															))}
														</select>
														어떤 값이면 :
														{required.values.map((v, i, arr) => (
															<React.Fragment key={"requiredVal" + i}>
																<input
																	type="text"
																	className="form-control"
																	value={v}
																	onChange={(e) => {
																		rArr[rIdx].values[i] = e.target.value;
																		set_requiredList([...requiredList]);
																	}}
																/>
																{arr.length > 1 && (
																	<button
																		className="btn btn-default"
																		onClick={() => {
																			arr.splice(i, 1);
																			set_requiredList([...requiredList]);
																		}}
																	>
																		-
																	</button>
																)}
															</React.Fragment>
														))}
														<button
															className="btn btn-danger"
															onClick={() => {
																required.values.push("");
																set_requiredList([...requiredList]);
															}}
														>
															+
														</button>
														몇 번 질문들을 가릴지 :{" "}
														{required.hide.map((v, i, arr) => {
															return (
																<React.Fragment key={"requiredHide" + i}>
																	<select
																		className="form-control"
																		value={v}
																		onChange={(e) => {
																			arr[i] = e.target.value;
																			console.log(e.target.value);
																			set_requiredList([...requiredList]);
																		}}
																	>
																		<option value=""></option>
																		{Array.from(
																			Array(
																				Object.keys(initData).reduce((acc: string[], cur: string) => {
																					const num = cur.split("_")[1];
																					if (!acc.includes(num)) acc.push(num);
																					return acc;
																				}, []).length
																			).keys(),
																			(i) => i + 1
																		).map((num) => {
																			return (
																				<option key={"rnum" + num} value={num}>
																					{num}번 질문
																				</option>
																			);
																		})}
																	</select>
																	{arr.length > 1 && (
																		<button
																			className="btn btn-default"
																			onClick={() => {
																				arr.splice(i, 1);
																				set_requiredList([...requiredList]);
																			}}
																		>
																			-
																		</button>
																	)}
																</React.Fragment>
															);
														})}
														<button
															className="btn btn-danger"
															onClick={() => {
																required.hide.push("");
																set_requiredList([...requiredList]);
															}}
														>
															+
														</button>
													</div>
												);
											})}
										</div>
										<div>
											<button
												className="btn btn-primary"
												onClick={() => {
													requiredList.push({
														attr: "",
														values: [""],
														hide: [""],
													});
													set_requiredList([...requiredList]);
												}}
											>
												추가+
											</button>
										</div>
									</div>
								</>
							) : (
								<button
									className="btn btn-success"
									onClick={() => {
										change_initData();
										set_requiredOn(true);
									}}
								>
									required 설정
								</button>
							)}
						</div>
						<header className="page_header">
							<b>{top_menuList[surveyPageNum - 1]}</b>
						</header>
						<>
							<div className="page_body">
								{munhangs.length > 0 &&
									munhangs.map((munhang, mIdx) => {
										let mainHide = false;
										if (munhang.required) {
											let count = 0;
											const leng = Object.keys(munhang.required).length;
											for (const key in munhang.required) {
												if (resultData[key] !== "" && resultData[key] !== munhang.required[key]) {
													count++;
												}
											}
											if (count === leng) {
												mainHide = true;
											}
										}
										return (
											<React.Fragment key={"munhang" + mIdx}>
												<section className={`flex munhang${mainHide ? " hide" : ""}`}>
													<div className="tit-col">
														<h3>
															{mIdx + 1}.{" "}
															<textarea
																className="smooth-textarea"
																value={munhang.title?.replace(/<br>/g, "\n") || ""}
																rows={(munhang.title?.match(/<br>/g)?.length || 0) + 1}
																onChange={(e) => {
																	if (e.target.value === "-") return;
																	const val = e.target.value.replace(/\n/g, "<br>");
																	munhang.title = val;
																	set_munhangs([...munhangs]);
																}}
															/>
															{mIdx > 0 && (
																<button
																	className="munhang-delete btn btn-lg btn-danger"
																	onClick={() => {
																		munhangs.splice(mIdx, 1);
																		set_munhangs([...munhangs]);
																	}}
																>
																	-
																</button>
															)}
														</h3>
													</div>
													<div className="desc-col R-list">
														<div>
															{munhang.mainTitle === undefined ? (
																<button
																	className="admin-plma"
																	onClick={() => {
																		munhang.mainTitle = "";
																		set_munhangs([...munhangs]);
																	}}
																>
																	메인질문+
																</button>
															) : (
																<div className="ask_t1">
																	<textarea
																		name=""
																		className="admin-textarea"
																		rows={
																			munhang.mainTitle?.match(/<br>/g)
																				? (munhang.title?.match(/<br>/g)?.length || 0) + 1
																				: 1
																		}
																		placeholder="메인 질문을 입력해주세요.(생략가능)"
																		value={munhang.mainTitle ? munhang.mainTitle.replace(/<br>/g, "\n") : ""}
																		onChange={(e) => {
																			munhang.mainTitle = e.target.value.replace(/\n/g, "<br>");
																			set_munhangs([...munhangs]);
																		}}
																	/>
																	<button
																		className="admin-plma"
																		onClick={() => {
																			munhang.mainTitle = undefined;
																			set_munhangs([...munhangs]);
																		}}
																	>
																		-
																	</button>
																</div>
															)}
														</div>
														<div>
															{munhang.mainAlert === undefined ? (
																<button
																	className="admin-plma"
																	onClick={() => {
																		munhang.mainAlert = {
																			color: "danger",
																			content: "",
																		};
																		set_munhangs([...munhangs]);
																	}}
																>
																	메인알림+
																</button>
															) : (
																<div
																	className={"alert bg-" + munhang.mainAlert.color}
																	// dangerouslySetInnerHTML={{ __html: munhang.mainAlert.content }}
																>
																	<textarea
																		name=""
																		className="admin-textarea"
																		rows={
																			munhang.mainAlert.content?.match(/<br>/g)
																				? (munhang.mainAlert.content.match(/<br>/g)?.length || 0) + 1
																				: 1
																		}
																		placeholder="메인알림을 입력해주세요."
																		value={
																			munhang.mainAlert.content
																				? munhang.mainAlert.content.replace(/<br>/g, "\n")
																				: ""
																		}
																		onChange={(e) => {
																			if (!munhang.mainAlert) return;
																			munhang.mainAlert.content = e.target.value.replace(/\n/g, "<br>");
																			set_munhangs([...munhangs]);
																		}}
																	/>
																	색변경:
																	<input
																		type="checkbox"
																		checked={munhang.mainAlert.color === "info"}
																		onChange={() => {
																			if (!munhang.mainAlert) return;
																			if (munhang.mainAlert.color === "info") {
																				munhang.mainAlert.color = "danger";
																			} else {
																				munhang.mainAlert.color = "info";
																			}
																			set_munhangs([...munhangs]);
																		}}
																	/>
																	<button
																		className="admin-plma"
																		onClick={() => {
																			munhang.mainAlert = undefined;
																			set_munhangs([...munhangs]);
																		}}
																	>
																		-
																	</button>
																</div>
															)}
														</div>

														{munhang.questions &&
															(() => {
																return munhang.questions.map((question, qIdx, qArr) => {
																	R_num++;
																	const commonProps = {
																		resultData,
																		initData,
																		changeResultData,
																		R_num,
																		changeSubcontents,
																	};
																	let hide = false;
																	if (question.required) {
																		let count = 0;
																		const leng = Object.keys(question.required).length;
																		for (const key in question.required) {
																			if (
																				resultData[key] !== "" &&
																				resultData[key] !== question.required[key]
																			) {
																				count++;
																			}
																		}
																		if (count === leng) {
																			hide = true;
																		}
																	}
																	return (
																		<div
																			key={"question" + qIdx}
																			id={`R_${R_num}`}
																			className={`question${hide || mainHide ? " hide" : ""}`}
																			style={{
																				position: "relative",
																				borderBottom: "3px double",
																				borderTop: qIdx === 0 ? "3px double" : "",
																			}}
																		>
																			<h2>{R_num}번 질문)</h2>
																			<div>
																				<button
																					className={`admin-plma${question.subPadding ? " red" : ""}`}
																					onClick={() => {
																						if (question.subPadding) question.subPadding = false;
																						else question.subPadding = true;
																						set_munhangs([...munhangs]);
																					}}
																				>
																					왼쪽 공백
																					{question.subPadding ? "-" : "+"}
																				</button>
																			</div>
																			<div className={`${question.subPadding ? "ask_wr" : "mt"}`}>
																				<div className="ask_t1">
																					<textarea
																						className="admin-textarea"
																						rows={
																							question.title?.match(/<br>/g)
																								? (question.title.match(/<br>/g)?.length || 0) + 1
																								: 1
																						}
																						placeholder="질문 제목을 입력해주세요."
																						value={
																							question.title
																								? question.title.replace(/<br>/g, "\n")
																								: ""
																						}
																						onChange={(e) => {
																							question.title = e.target.value.replace(/\n/g, "<br>");
																							set_munhangs([...munhangs]);
																						}}
																					/>
																				</div>
																				<div>
																					질문형태 :{" "}
																					<select
																						name=""
																						className="form-control"
																						value={question.qType || ""}
																						onChange={(e) => {
																							question.qType = e.target.value as Question["qType"];
																							set_munhangs([...munhangs]);
																						}}
																					>
																						<option value="">-선택-</option>
																						<option value="MultiTable">테이블</option>
																						<option value="MultiChoice">객관식</option>
																						<option value="EtcText">텍스트</option>
																						<option value="EtcTextarea">여러줄텍스트</option>
																					</select>
																				</div>
																				<h3>- 설정</h3>
																				{question.qType === "MultiTable" && !question.tableType && (
																					<AdminMultiTable
																						subContents={(question as MultiTableQuestion).subContents}
																						{...commonProps}
																						change_initData={change_initData}
																					/>
																				)}
																				{/* 안쓰는거 같은데 확인해봐야함.... */}
																				{/* {question.qType === "MultiTable" &&
																					question.tableType === "excelTable" && (
																						<AdminMultiTableExcel
																							subContents={(question as MultiTableQuestion).subContents}
																							{...commonProps}
																						/>
																					)} */}
																				{question.qType === "MultiChoice" && (
																					<AdminMultiChoice
																						subContents={(question as MultiChoiceQuestion).subContents}
																						{...commonProps}
																					/>
																				)}
																				{question.qType === "EtcText" && (
																					<AdminEtcText
																						subContents={(question as EtcTextQuestion).subContents}
																						{...commonProps}
																					/>
																				)}
																				{question.qType === "EtcTextarea" && (
																					<AdminEtcTextarea
																						subContents={(question as EtcTextareaQuestion).subContents}
																						{...commonProps}
																					/>
																				)}
																				<h3>- 결과</h3>
																				{question.qType === "MultiTable" && (
																					<MultiTable
																						subContents={(question as MultiTableQuestion).subContents}
																						{...commonProps}
																					/>
																				)}
																				{question.qType === "MultiChoice" && (
																					<MultiChoice
																						subContents={(question as MultiChoiceQuestion).subContents}
																						{...commonProps}
																					/>
																				)}
																				{question.qType === "EtcText" && (
																					<EtcText
																						subContents={(question as EtcTextQuestion).subContents}
																						{...commonProps}
																					/>
																				)}
																				{question.qType === "EtcTextarea" && (
																					<EtcTextarea
																						subContents={(question as EtcTextareaQuestion).subContents}
																						{...commonProps}
																					/>
																				)}
																			</div>
																			{question.alert ? (
																				<div
																					className={"alert bg-" + question.alert.color}
																					// dangerouslySetInnerHTML={{ __html: question.alert.content }}
																				>
																					<textarea
																						name=""
																						className="admin-textarea"
																						rows={
																							question.alert.content?.match(/<br>/g)
																								? (question.alert.content.match(/<br>/g)?.length ||
																										0) + 1
																								: 1
																						}
																						placeholder="질문알림을 입력해주세요."
																						value={
																							question.alert.content
																								? question.alert.content.replace(/<br>/g, "\n")
																								: ""
																						}
																						onChange={(e) => {
																							if (!question.alert) return;
																							question.alert.content = e.target.value.replace(
																								/\n/g,
																								"<br>"
																							);
																							set_munhangs([...munhangs]);
																						}}
																					/>
																					색변경:
																					<input
																						type="checkbox"
																						checked={question.alert.color === "info"}
																						onChange={() => {
																							if (!question.alert) return;
																							if (question.alert.color === "info") {
																								question.alert.color = "danger";
																							} else {
																								question.alert.color = "info";
																							}
																							set_munhangs([...munhangs]);
																						}}
																					/>
																					<button
																						className="admin-plma"
																						onClick={() => {
																							question.alert = undefined;
																							set_munhangs([...munhangs]);
																						}}
																					>
																						-
																					</button>
																				</div>
																			) : (
																				<div>
																					<button
																						className="admin-plma"
																						onClick={() => {
																							question.alert = {
																								color: "danger",
																								content: "",
																							};
																							set_munhangs([...munhangs]);
																						}}
																					>
																						질문알림+
																					</button>
																				</div>
																			)}
																			<div
																				style={{
																					textAlign: "left",
																					padding: "5px",
																					position: "absolute",
																					bottom: "0",
																					right: "-100px",
																				}}
																			>
																				{munhangs[mIdx].questions[qIdx].title &&
																				Object.keys(munhangs[mIdx].questions[qIdx].subContents).length > 0 ? (
																					<button
																						type="button"
																						className="btn btn-lg btn-default"
																						style={{
																							padding: "5px 8px",
																							marginBottom: "5px",
																						}}
																						onClick={() => {
																							copyText(JSON.stringify(munhangs[mIdx].questions[qIdx]));
																						}}
																					>
																						질문 복사
																					</button>
																				) : (
																					<button
																						type="button"
																						className="btn btn-lg btn-default"
																						style={{
																							padding: "5px 8px",
																							marginBottom: "5px",
																						}}
																						onClick={async () => {
																							try {
																								const text = await navigator.clipboard.readText();
																								const question = JSON.parse(text) || undefined;
																								if (
																									question &&
																									question.title &&
																									Object.keys(question.subContents).length > 0
																								) {
																									munhangs[mIdx].questions[qIdx] = question;

																									set_munhangs([...munhangs]);
																								} else {
																									dispatch({
																										type: "modal/on_modal_alert",
																										payload: "형태가 맞지않습니다.",
																									});
																								}
																								console.log("클립보드에서 읽은 텍스트:", text);
																							} catch (err) {
																								console.error("클립보드 읽기 실패:", err);
																							}
																						}}
																					>
																						붙여넣기
																					</button>
																				)}
																				<br />
																				<button
																					type="button"
																					className="btn btn-lg btn-danger"
																					style={{
																						padding: "5px 8px",
																						marginBottom: "5px",
																					}}
																					onClick={() => {
																						munhangs[mIdx].questions.splice(qIdx, 1);
																						if (munhangs[mIdx].questions.length == 0) {
																							munhangs.splice(mIdx, 1);
																						}

																						set_munhangs([...munhangs]);
																					}}
																				>
																					질문 -
																				</button>
																				<br></br>
																				<button
																					type="button"
																					className="btn btn-lg btn-success"
																					style={{
																						padding: "5px 8px",
																						marginBottom: "5px",
																					}}
																					onClick={() => {
																						const fList = munhangs[mIdx].questions.slice(0, qIdx);
																						const bList = munhangs[mIdx].questions.slice(
																							qIdx,
																							qArr.length
																						);

																						munhangs[mIdx].questions = [
																							...fList,
																							{
																								title: "",
																								subContents: {},
																							},
																							...bList,
																						];

																						set_munhangs([...munhangs]);
																					}}
																				>
																					질문+ ↑
																				</button>
																				<br />
																				<button
																					type="button"
																					className="btn btn-lg btn-success"
																					style={{
																						padding: "5px 8px",
																					}}
																					onClick={() => {
																						const fList = munhangs[mIdx].questions.slice(0, qIdx + 1);
																						const bList = munhangs[mIdx].questions.slice(
																							qIdx + 1,
																							qArr.length
																						);

																						munhangs[mIdx].questions = [
																							...fList,
																							{
																								title: "",
																								subContents: {},
																							},
																							...bList,
																						];

																						set_munhangs([...munhangs]);
																					}}
																				>
																					질문+ ↓
																				</button>
																			</div>
																		</div>
																	);
																});
															})()}
													</div>
												</section>
												<div className="admin-questionAdd"></div>
											</React.Fragment>
										);
									})}
							</div>
							<div className="admin-munhangAdd">
								<button
									className="btn btn-lg btn-info"
									onClick={() => {
										munhangs.push({
											title: "",
											questions: [
												{
													qType: "",
													title: "",
													alert: null,
													subPadding: false,
													subContents: {},
												},
											],
										});
										set_munhangs([...munhangs]);
									}}
								>
									문항 +
								</button>
							</div>
						</>
					</div>
				</form>
			</div>
			<div className="btn_foot">
				<div className="btn_foot_wr">
					<button type="button" className="btn btn-lg btn-danger" onClick={store_surveyInfo}>
						저장하기
					</button>{" "}
					<button type="button" className="btn btn-lg btn-success" onClick={create_resultTable}>
						결과테이블만들기
					</button>
					<p>* 자주 저장하여 설정한 것이 날아가지 않게...</p>
				</div>
			</div>
		</div>
	);
}
