/* 관리자 설문 문항 설정 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
// import { adminDeleteSurvey, getAdminSurveyResult } from "../compositions/admin";
import { useDispatch } from "react-redux";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import AllLoding from "../components/AllLoding";
import { useAdminSurveyResult } from "../hooks/admin/useAdminSurveyResult";
import { useAdminSurveyResultDelete } from "../hooks/admin/useAdminSurveyResultDelete";
import { useAdminSurveyResultSubmitCancel } from "../hooks/admin/useAdminSurveyResultSubmitCancel";

export default function AdminResults() {
	const { surveyType, surveyPage } = useParams() as { surveyType: string; surveyPage: string };
	const surveyPageNum = Number(surveyPage);
	const dispatch = useDispatch();
	const location = useLocation();
	const { data: surveyResultData, isError, error, refetch } = useAdminSurveyResult(surveyType, surveyPage);
	const { mutate: surveyResultDelete } = useAdminSurveyResultDelete();
	const { mutate: surveySubmitCancel } = useAdminSurveyResultSubmitCancel();

	const [allLoding, set_allLoding] = useState(false);
	const [title, set_title] = useState("");
	const [top_menu_list, set_top_menu_list] = useState<string[]>([]);
	const [survey_thead, set_survey_thead] = useState<string[]>([]);
	const [surveyResult, set_surveyResult] = useState<Record<string, string>[]>([]);

	const [excelList, set_excelList] = useState<Record<string, string>[]>([]);

	// th에 따른 정렬
	const sortFnc = useCallback(
		(a: string, b: string): number => {
			const aNum = Number(a.split("_")[1]);
			const bNum = Number(b.split("_")[1]);
			if (!isNaN(aNum) && !isNaN(bNum)) {
				const allPage_sortFnc_result = allPage_sortFnc();
				if (allPage_sortFnc_result !== 0) {
					return allPage_sortFnc_result;
				} else {
					if (aNum - bNum !== 0) return aNum - bNum > 0 ? 1 : -1;
					else {
						if (!a.endsWith("_etc") && b.endsWith("_etc")) {
							return -1;
						} else if (a.endsWith("_etc") && !b.endsWith("_etc")) {
							return 1;
						} else if (a.endsWith("_fWei") && b.endsWith("_bWei")) {
							return -1;
						} else if (a.endsWith("_bWei") && b.endsWith("_fWei")) {
							return 1;
						} else {
							const aNum2 = Number(a.split("_")[2]);
							const bNum2 = Number(b.split("_")[2]);
							if (isNaN(aNum2) && isNaN(bNum2)) {
								return depth3();
							} else if (!isNaN(aNum2) && isNaN(bNum2)) {
								return -1;
							} else if (isNaN(aNum2) && !isNaN(bNum2)) {
								return 1;
							} else {
								if (aNum2 - bNum2 !== 0) return aNum2 - bNum2 > 0 ? 1 : -1;
								else return depth3();
							}
							function depth3(): number {
								const aNum3 = Number(a.split("_")[3]);
								const bNum3 = Number(b.split("_")[3]);
								if (isNaN(aNum3) && isNaN(bNum3)) {
									return depth4();
								} else if (!isNaN(aNum3) && isNaN(bNum3)) {
									return -1;
								} else if (isNaN(aNum3) && !isNaN(bNum3)) {
									return 1;
								} else {
									if (aNum3 - bNum3 !== 0) return aNum3 - bNum3 > 0 ? 1 : -1;
									else return depth4();
								}
								function depth4(): number {
									const a4 = a.split("_")[4];
									const b4 = b.split("_")[4];
									if (a4 === "f" && b4 === "b") {
										return -1;
									} else if (a4 === "b" && b4 === "f") {
										return 1;
									}
									return 0;
								}
							}
						}
					}
				}
			} else {
				return 0;
			}
			function allPage_sortFnc() {
				if (surveyPage == "all") {
					const aPageNum = Number(a.charAt(1));
					const bPageNum = Number(b.charAt(1));
					if (aPageNum !== bPageNum) {
						return aPageNum > bPageNum ? 1 : -1;
					} else {
						return 0;
					}
				} else {
					return 0;
				}
			}
		},
		[surveyPage]
	);
	// th마다 스타일 주기
	const keyStyle = (key: string) => {
		const obj: { minWidth?: string } = {};
		switch (key) {
			case "R_Cate":
			case "R_Div":
				obj.minWidth = "50px";
				break;
			case "R_Position":
				obj.minWidth = "60px";
				break;
			case "R_Name":
			case "recommend":
			case "R_COMMON_1_1":
			case "R_COMMON_1_2":
				obj.minWidth = "70px";
				break;
			case "tesmi_status":
			case "zonecode":
				obj.minWidth = "80px";
				break;
			case "R_Part_Name":
			case "tesmi_regdate":
			case "tesmi_status_date":
				obj.minWidth = "100px";
				break;
			case "regdate":
				obj.minWidth = "110px";
				break;
			case "addr_detail":
			case "R_Cate_Name":
				obj.minWidth = "120px";
				break;
			case "R_Company_Name":
				obj.minWidth = "150px";
				break;
			case "addr_road":
				obj.minWidth = "200px";
				break;
		}
		return obj;
	};
	// 아예 보여주기 제외할 key
	const except_key = useMemo(
		() => [
			"idx",
			"R_COMMON_1_3",
			"R_COMMON_1_4",
			"R_COMMON_1_5",
			"R_COMMON_1_6",
			"R_COMMON_1_7",
			"R_COMMON_1_8",
			"R_COMMON_1_9",
			"R_COMMON_1_10",
			"R_COMMON_1_11",
			"R_COMMON_1_12",
			"R_COMMON_1_13",
			"R_COMMON_1_14",
			"R_COMMON_1_15",
			"R_COMMON_1_16",
			"R_COMMON_1_17",
			"R_COMMON_1_18",
			"R_COMMON_1_19",
			"R_COMMON_1_20",
		],
		[]
	);
	// th 한글로 변경
	const keyTrans = (key: string): string => {
		switch (key) {
			case "tesmi_target":
				return "이메일";
			case "tesmi_regdate":
				return "인증완료시간";
			case "tesmi_status":
				return "완료여부";
			case "tesmi_status_date":
				return "설문완료시간";
			case "regdate":
				return "페이지 저장시간";
			/*  */
			case "R_Name":
				return "성명";
			case "R_Position":
				return "직급";
			case "R_Tel_No":
				return "사무실 전화번호";
			case "R_C_Tel_No":
				return "휴대전화번호";
			case "zonecode":
				return "사무실 주소번호";
			case "addr_road":
				return "사무실 주소";
			case "addr_detail":
				return "상세주소";
			case "R_Email":
				return "이메일";
			case "R_Div":
				return "회사 구분";
			case "R_Company_Name":
				return "회사 (기관)명";
			case "R_Part_Name":
				return "부서 (팀)명";
			case "R_Cate":
				return "업종";
			case "R_Cate_Name":
				return "업종명";
			case "R_Biz_Reg_No":
				return "사업자 등록번호";
			case "R_COMMON_1_1":
				return "매출 총액";
			case "R_COMMON_1_2":
				return "전체 직원수";
			case "recommend":
				return "요청 직원";
			default:
				return key;
		}
	};
	// 완료 설문 갯수
	const [complete_count, set_complete_count] = useState(0);
	// td 한글로 변경
	const valueTrans = (value: [string, number | string]): string => {
		switch (value[0]) {
			case "tesmi_status":
				return value[1] === 10 ? "완료" : "설문중";
			case "tesmi_regdate":
				return value[1].toString().substring(0, 16);
			case "tesmi_status_date":
				return value[1].toString().substring(0, 16);
			case "regdate":
				return value[1].toString().substring(0, 16);
		}
		if (value[0].endsWith("_cheOrder")) {
			const orderList = String(value[1]).split(",");
			const result = orderList.reduce<string[]>((acc, cur, i) => {
				const list = cur.split("-");
				acc.push(`${i + 1})${list[0]}_${list[1]}`);
				return acc;
			}, []);
			return result.join(",");
		} else if (!value[0].endsWith(`_etc`)) {
			return value[1]
				? String(value[1]).includes(",")
					? value[1]
							.toString()
							.split(",")
							.sort((a, b) => Number(a) - Number(b))
							.join(",")
					: String(value[1])
				: "";
		} else return String(value[1]);
	};
	const valueTrans2 = (value: [string, number | string], result1: string): string => {
		switch (value[0]) {
			case "tesmi_status":
				return value[1] === 10 ? "<span class='c_green f-bold'>완료</span>" : "<span class='c_red f-bold'>설문중</span>";
			default:
				return result1;
		}
	};

	// 설문 삭제
	const survey_delete = (email: string) => {
		if (confirm(`${email}\n해당 이메일의 설문을 삭제하시겠습니까??`)) {
			surveyResultDelete(
				{ surveyType, email },
				{
					onSuccess(data) {
						console.log(data);
						if (data.code === 200) refetch();
						else dispatch({ type: "modal/on_modal_alert", payload: "오류 발생" });
					},
					onError() {
						dispatch({ type: "modal/on_modal_alert", payload: "오류 발생" });
					},
				}
			);
		}
	};
	// 설문 최종제출 취소
	const submit_cancel = (email: string) => {
		if (confirm(`${email}\n해당 설문을 제출취소 하시겠습니까??`)) {
			surveySubmitCancel(
				{ surveyType, email },
				{
					onSuccess(data) {
						if (data.code === 200) refetch();
						else dispatch({ type: "modal/on_modal_alert", payload: "오류 발생" });
					},
					onError() {
						dispatch({ type: "modal/on_modal_alert", payload: "오류 발생" });
					},
				}
			);
		}
	};

	const init = useCallback(() => {
		set_title("");
		set_top_menu_list([]);
		set_complete_count(0);
		set_survey_thead([]);
		set_surveyResult([]);
		set_excelList([]);
		set_allLoding(true);
		if (surveyResultData) {
			const data = surveyResultData;
			console.log(data);
			if (data.code === 200) {
				let ccount = 0;
				const exList: Record<string, string>[] = [];
				if (data.data.store_data_list.length > 0) {
					data.data.store_data_list.map((v) => {
						if (v["tesmi_status"] == 10) ccount++;
					});
					const headList: string[] = [];
					Object.entries(data.data.store_data_list[0])
						.filter((entry) => !except_key.some((v) => entry[0].includes(v)))
						.filter((entry) => (/^p\d+\)/.test(entry[0]) ? !entry[0].includes("regdate") : true))
						.sort((a, b) => sortFnc(a[0], b[0]))
						.map((entry) => {
							headList.push(entry[0]);
						});
					const dataList = data.data.store_data_list.map((surveyVal) => {
						const excelObj: Record<string, string> = {};
						const newObj: Record<string, string> = {};
						headList.map((thead) => {
							const result = surveyVal[thead];
							excelObj[keyTrans(thead)] = valueTrans([thead, result]);
							newObj[thead] = valueTrans2([thead, result], valueTrans([thead, result]));
						});
						return newObj;
					});
					set_complete_count(ccount);
					set_survey_thead(headList);
					set_surveyResult(dataList);
					set_excelList(exList);
				}
				set_title(data.data.tesci_name);
				set_top_menu_list(data.data.top_menu_list);
			} else {
				dispatch({ type: "modal/on_modal_alert", payload: "설문결과가 존재하지 않습니다." });
			}
			set_allLoding(false);
		} else if (isError) {
			console.log(error);
		}
	}, [surveyResultData, dispatch, error, isError, except_key, sortFnc]);

	useEffect(() => {
		init();
	}, [location.pathname, init]);
	return (
		<>
			{allLoding && <AllLoding />}
			<div id="adminSurveyResult">
				<div className="header-wrap">
					<div>
						<h1>{title} 설문결과</h1>
						<header className="top_menu" style={{ marginBottom: "0" }}>
							<Link className={surveyPage == "all" ? "-active" : ""} to={`/admin/${surveyType}/result/all`}>
								All
							</Link>
							<Link className={surveyPageNum == 0 ? "-active" : ""} to={`/admin/${surveyType}/result/0`}>
								INFO
							</Link>
							{top_menu_list.map((v, i) => (
								<Link
									key={"top_menu_list" + i}
									className={surveyPageNum == i + 1 ? "-active" : ""}
									to={`/admin/${surveyType}/result/${i + 1}`}
								>
									{v}
								</Link>
							))}
						</header>
					</div>
				</div>

				<div className="table">
					<div style={{ padding: "0 0 10px 15px", fontSize: "20px" }}>
						<ExportToExcel data={excelList} title={title} surveyPage={surveyPage} />
						&nbsp;&nbsp;전체: <span className="f-bold">{surveyResult.length}</span>, 완료:{" "}
						<span className="c_green f-bold">{complete_count}</span>, 설문중:{" "}
						<span className="c_red f-bold">{surveyResult.length - complete_count}</span>
					</div>
					{survey_thead.length > 0 && (
						<table className="tbl_style1" style={{ backgroundColor: "#fff" }}>
							<thead>
								<tr>
									<th>No</th>
									<th>
										삭제
										<br />
										하기
									</th>
									<th style={{ minWidth: "80px" }}>
										최종제출
										<br />
										취소
									</th>
									{survey_thead.map((key, i) => {
										return (
											<th
												key={"resultTh" + i}
												style={keyStyle(key)}
												dangerouslySetInnerHTML={{
													__html: keyTrans(key).replace(" ", "<br>"),
												}}
											></th>
										);
									})}
								</tr>
							</thead>
							<tbody>
								{surveyResult.map((surveyVal, i) => (
									<tr key={`surveyResulttr` + i}>
										<td>{i + 1}</td>
										<td>
											<button
												className="btn btn-danger"
												onClick={() => {
													if (surveyPageNum == 0) {
														survey_delete(surveyVal["tesmi_target"]);
													} else {
														alert("설문결과 자체를 삭제하는 것으로\nINFO에서 삭제바랍니다.");
													}
												}}
											>
												삭제
											</button>
										</td>
										<td style={{ textAlign: "center" }}>
											{surveyVal["tesmi_status"].includes("완료") && (
												<button
													className="btn btn-warning"
													onClick={() => {
														submit_cancel(surveyVal["tesmi_target"]);
													}}
												>
													취소
												</button>
											)}
										</td>
										{Object.values(surveyVal).map((tdVal, i2) => {
											return (
												<td
													key={`result` + i2}
													dangerouslySetInnerHTML={{
														__html: tdVal,
													}}
												></td>
											);
										})}
									</tr>
								))}
							</tbody>
						</table>
					)}
				</div>
			</div>
		</>
	);
}

const ExportToExcel = ({ data, title, surveyPage }: { data: Record<string, string>[]; title: string; surveyPage: number | string }) => {
	const exportToExcel = () => {
		// Create a new workbook and a worksheet
		const wb = XLSX.utils.book_new();
		const ws = XLSX.utils.json_to_sheet(data);

		// Append the worksheet to the workbook
		XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

		// Generate buffer
		const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

		// Save to file
		const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
		saveAs(blob, `${title}_${surveyPage == "all" ? "All" : surveyPage == 0 ? "INFO" : surveyPage + "surveyPage"}.xlsx`);
	};

	return (
		<button className="btn btn-success" onClick={exportToExcel} style={{ fontSize: "20px" }}>
			{`${title}_${surveyPage == "all" ? "All" : surveyPage == 0 ? "INFO" : surveyPage + "page"}.xlsx`}
		</button>
	);
};
