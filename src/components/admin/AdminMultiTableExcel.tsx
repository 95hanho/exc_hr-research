// import React, { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import ModalJimoon from "../modal/ModalJimoon";
// import { AdminSurveyQuestionProps, MultiTableQuestion, ResultData } from "../../types/survey";

// interface MultiTableProps extends AdminSurveyQuestionProps {
// 	subContents: MultiTableQuestion["subContents"];
// 	initData: ResultData;
// }

// /*
//  * 여러용도테이블 엑셀로 넣기 버전
//  */
// export default function AdminMultiTableExcel({ subContents, R_num, changeSubcontents }: MultiTableProps) {
// 	const dispatch = useDispatch();

// 	const executeChange = () => {
// 		changeSubcontents(R_num, subContents);
// 	};

// 	const [modalOn, set_modalOn] = useState(false);
// 	const [inputIndex, set_inputIndex] = useState(0);
// 	// 엑셀 지문넣기
// 	const input_jimoon = (excelData: string[][]) => {
// 		excelData.map((v, i) => {
// 			if (!subContents.table_td[i]) subContents.table_td.push(new Array(subContents.table_td[0].length).fill(""));
// 			subContents.table_td[i].map((td, tdIdx, tdArr) => {
// 				if (inputIndex == tdIdx) {
// 					tdArr[tdIdx] = v[0] === "기타" ? "R_etc" : v[0];
// 				} else if (!td) {
// 					tdArr[tdIdx] = "";
// 				}
// 			});
// 		});
// 		executeChange();
// 	};

// 	useEffect(() => {
// 		subContents.table_th = [[""]];
// 		subContents.table_td = [[""]];
// 		executeChange();
// 	}, []);

// 	return (
// 		<div className="table adminMultiTable">
// 			<h4 className="c_red">엑셀용임</h4>
// 			<div>
// 				<button
// 					className={`admin-plma${subContents.topAlert === "weightDoubleFive" ? " red" : ""}`}
// 					onClick={() => {
// 						if (subContents.topAlert === "weightDoubleFive") subContents.topAlert = undefined;
// 						else subContents.topAlert = "weightDoubleFive";
// 						executeChange();
// 					}}
// 				>
// 					중요도&수행도 알림{subContents.topAlert === "weightDoubleFive" ? "-" : "+"}
// 				</button>{" "}
// 				<button
// 					className={`admin-plma${subContents.topAlert instanceof Array ? " red" : ""}`}
// 					onClick={() => {
// 						if (subContents.topAlert instanceof Array) subContents.topAlert = undefined;
// 						else subContents.topAlert = ["전혀 아님", "아님", "보통", "그러함", "매우 그러함"];
// 						executeChange();
// 					}}
// 				>
// 					가중치알림{subContents.topAlert instanceof Array ? "-" : "+"}
// 				</button>{" "}
// 				<button
// 					className={`admin-plma${subContents.topAlert instanceof Array ? " red" : ""}`}
// 					onClick={() => {
// 						if (subContents.topAlert instanceof Array) subContents.topAlert = undefined;
// 						else subContents.topAlert = ["전혀 아님", "아님", "보통", "그러함", "매우 그러함"];
// 						executeChange();
// 					}}
// 				>
// 					지문번호 붙이기{subContents.table_td[0] instanceof Array ? "-" : "+"}
// 				</button>
// 			</div>
// 			<div>
// 				예시불러오기 :{" "}
// 				<select
// 					name=""
// 					id=""
// 					className="form-control"
// 					onChange={(e) => {
// 						const val = Number(e.target.value);
// 						delete subContents.topAlert;
// 						delete subContents.table_set;
// 						if (val === 1) {
// 							subContents.table_th = [[""]];
// 							subContents.table_td = [[""]];
// 						} else if (val === 2) {
// 							subContents.table_th = [["No", "문항내용", "현재", "향후<br>(1~3년 내)"]];
// 							subContents.table_td = [["$index", "문항내용을 입력해주세요.", "R_per", "R_per"]];
// 						} else if (val === 3) {
// 							subContents.topAlert = ["전혀 아님", "아님", "보통", "그러함", "매우 그러함"];
// 							subContents.table_th = [["No", "문항", "1", "2", "3", "4", "5"]];
// 							subContents.table_td = [["$index", "문항내용을 입력해주세요.", "R_wei"]];
// 						} else if (val === 4) {
// 							subContents.topAlert = "weightDoubleFive";
// 							subContents.table_th = [
// 								[
// 									"$rowSpan1|No",
// 									"$rowSpan1|문항내용",
// 									"$colSpan4|중요도",
// 									"-",
// 									"-",
// 									"-",
// 									"-",
// 									"$colSpan4|수행도",
// 									"-",
// 									"-",
// 									"-",
// 									"-",
// 								],
// 								["-", "-", "1", "2", "3", "4", "5", "1", "2", "3", "4", "5"],
// 							];
// 							subContents.table_td = [["$index", "문항내용을 입력해주세요.", "R_wei", "R_wei"]];
// 						} else if (val == 5) {
// 							subContents.table_th = [["No", "문항", "인적자원"]];
// 							subContents.table_td = [
// 								["$index", "문항내용을 입력해주세요.", "R_people"],
// 								["$index", "문항내용을 입력해주세요.", "R_year"],
// 								["$index", "문항내용을 입력해주세요.", "R_won"],
// 								["$index", "문항내용을 입력해주세요.", "R_term"],
// 								["$index", "문항내용을 입력해주세요.", "R_time"],
// 								["$index", "문항내용을 입력해주세요.", "R_resource"],
// 							];
// 						} else if (val == 6) {
// 							subContents.table_th = [
// 								["구분", "$width12|1%~5%", "$width12|6%~25%", "$width12|16%~25%", "$width12|26%~50%", "$width12|51이상"],
// 							];
// 							subContents.table_td = [
// 								["증가<br>3)번 문항 이동", "R_increDecre"],
// 								["감소<br>3)번 문항 이동, 해당 인원수(전담 사내강사)", "R_increDecre"],
// 							];
// 						} else if (val == 7) {
// 							subContents.table_th = [["No", "항목", "체크"]];
// 							subContents.table_td = [
// 								["$index", "항목내용을 입력해주세요.", "R_radio"],
// 								["$index", "항목내용을 입력해주세요.", "R_radio"],
// 							];
// 						} else if (val == 8) {
// 							subContents.table_th = [["No", "항목", "체크"]];
// 							subContents.table_td = [
// 								["$index", "항목내용을 입력해주세요.", "R_check"],
// 								["$index", "항목내용을 입력해주세요.", "R_check"],
// 							];
// 						} else if (val == 9) {
// 							subContents.table_th = [["No", "항목", "활용여부", "효과성"]];
// 							subContents.table_td = [
// 								["$index", "항목내용을 입력해주세요.", "R_relCheck"],
// 								["$index", "항목내용을 입력해주세요.", "R_relCheck"],
// 							];
// 						} else if (val == 10) {
// 							subContents.table_th = [
// 								["$rowSpan1|No", "$rowSpan1|항목", "$rowSpan1|체크", "$colSpan4|만족도", "-", "-", "-", "-"],
// 								["-", "-", "-", "매우<br>낮음", "낮음", "보통", "높음", "매우<br>높음"],
// 							];
// 							subContents.table_td = [
// 								["$index", "항목내용을 입력해주세요.", "R_relWeight"],
// 								["$index", "항목내용을 입력해주세요.", "R_relWeight"],
// 							];
// 						}
// 						executeChange();
// 					}}
// 				>
// 					<option value="1">사용자지정</option>
// 					<option value="2">비율 계</option>
// 					<option value="3">가중치</option>
// 					<option value="4">중요도수행도</option>
// 					<option value="5">인적자원</option>
// 					<option value="6">증가감소</option>
// 					<option value="7">단일선택</option>
// 					<option value="8">복수선택</option>
// 					<option value="9">연관체크</option>
// 					<option value="10">연관가중치</option>
// 				</select>
// 				<span className="c_red">* 예시불러오기 시 현재설정 사라짐</span>
// 			</div>
// 			{subContents.topAlert instanceof Array && (
// 				<div>
// 					<h4>가중치알림 텍스트</h4>
// 					<div className="table">
// 						<table className="tbl_style1 weight-alert">
// 							<thead>
// 								<tr>
// 									{subContents.topAlert.map((th, thIdx) => (
// 										<th key={"weightTh" + thIdx}>
// 											<input
// 												type="text"
// 												value={th}
// 												style={{ width: "100%" }}
// 												onChange={(e) => {
// 													if (Array.isArray(subContents.topAlert)) subContents.topAlert[thIdx] = e.target.value;
// 													executeChange();
// 												}}
// 											/>
// 										</th>
// 									))}
// 								</tr>
// 							</thead>
// 						</table>
// 					</div>
// 				</div>
// 			)}

// 			<div className="admin-th" style={{ position: "relative" }}>
// 				<h4>
// 					테이블제목{" "}
// 					{!subContents.table_set ? (
// 						<button
// 							className="admin-plma green"
// 							onClick={() => {
// 								subContents.table_set = true;
// 								executeChange();
// 							}}
// 						>
// 							사이즈, 합치기, 디자인 설정
// 						</button>
// 					) : (
// 						<button
// 							className="admin-plma red"
// 							onClick={() => {
// 								subContents.table_set = undefined;
// 								executeChange();
// 							}}
// 						>
// 							사이즈, 합치기, 디자인 설정 숨기기
// 						</button>
// 					)}
// 				</h4>
// 				<table className="tbl_style1">
// 					<thead>
// 						{Array.isArray(subContents.table_th) &&
// 							subContents.table_th?.map((tr, trIdx) => {
// 								const key = "tr" + trIdx;
// 								return (
// 									<tr key={key}>
// 										{Array.isArray(tr) &&
// 											tr.map((th, thIdx, thArr) => {
// 												const style: { width?: number } = {};
// 												const attr: { rowSpan?: number; colSpan?: number } = {};
// 												let rowSpan = 0;
// 												let colSpan = 0;
// 												let width = 0;

// 												// th 첫 문자열(속성적용용)
// 												const frontStr = (rs: number, cs: number, wid: number) => {
// 													const rowSpanV = rs == 0 ? 0 : rs || rowSpan;
// 													const colSpanV = cs == 0 ? 0 : cs || colSpan;
// 													const widV = wid == 0 ? 0 : wid || width;
// 													return `${rowSpanV ? "$rowSpan" + rowSpanV + "|" : ""}${
// 														colSpanV ? "$colSpan" + colSpanV + "|" : ""
// 													}${widV ? "$width" + widV + "|" : ""}`;
// 												};
// 												// 합치기 가능한지 검사
// 												const combineCheck = (rs: number, cs: number, trIndex: number, thIndex: number) => {
// 													let result = true;
// 													const rowSpanV = rs > rowSpan ? rs : rowSpan;
// 													const colSpanV = cs > colSpan ? cs : colSpan;
// 													for (let i = trIndex; i <= trIndex + rowSpanV; i++) {
// 														for (let j = thIndex; j <= thIndex + colSpanV; j++) {
// 															if (i == trIndex && j == thIndex) continue;
// 															if (
// 																subContents.table_th[i] == undefined ||
// 																subContents.table_th[i][j] == undefined ||
// 																subContents.table_th[i][j].startsWith("$rowSpan") ||
// 																subContents.table_th[i][j].startsWith("$colSpan")
// 															) {
// 																result = false;
// 																break;
// 															}
// 														}
// 														if (!result) break;
// 													}
// 													return result;
// 												};
// 												// 합치기(합치는건 '-'로 만들고 취소시키는건 ''로 만듬)
// 												const combine = (rs: number, cs: number, trIndex: number, thIndex: number) => {
// 													const rowSpanV = rs || rowSpan;
// 													const colSpanV = cs || colSpan;
// 													for (let i = trIndex; i <= trIndex + rowSpanV; i++) {
// 														for (let j = thIndex; j <= thIndex + colSpanV; j++) {
// 															if (i == trIndex && j == thIndex) continue;
// 															subContents.table_th[i][j] = "-";
// 														}
// 													}
// 												};
// 												// 합치기 취소
// 												const combineCancel = (rs: number, cs: number, trIndex: number, thIndex: number) => {
// 													const rowSpanV = rs > rowSpan ? rs : rowSpan;
// 													const colSpanV = cs > colSpan ? cs : colSpan;
// 													for (let i = trIndex; i <= trIndex + rowSpanV; i++) {
// 														for (let j = thIndex; j <= thIndex + colSpanV; j++) {
// 															if (i == trIdx && j == thIdx) continue;
// 															if (rs != undefined) {
// 																if (i > trIndex + rs) subContents.table_th[i][j] = "";
// 															} else if (cs != undefined) {
// 																if (j > thIndex + cs) subContents.table_th[i][j] = "";
// 															}
// 														}
// 													}
// 												};

// 												if (th.startsWith("$rowSpan")) {
// 													const thList = th.split("|");
// 													rowSpan = Number(thList[0].replace("$rowSpan", ""));
// 													attr.rowSpan = rowSpan + 1;
// 													th = th.replace(thList[0] + "|", "");
// 												}
// 												if (th.startsWith("$colSpan")) {
// 													const thList = th.split("|");
// 													colSpan = Number(thList[0].replace("$colSpan", ""));
// 													attr.colSpan = colSpan + 1;
// 													th = th.replace(thList[0] + "|", "");
// 												}
// 												if (th.startsWith("$width")) {
// 													width = Number(th.split("|")[0].replace("$width", ""));
// 													style.width = width + "%";
// 													th = th.replace(th.split("|")[0] + "|", "");
// 												}

// 												const eleList = [];
// 												if (th === "-")
// 													eleList.push(
// 														<th key={"th" + thIdx} style={{ width: `${(100 - 6) / thArr.length}%` }}>
// 															-
// 														</th>
// 													);
// 												else {
// 													eleList.push(
// 														<th key={"th" + thIdx} style={{ width: `${(100 - 6) / thArr.length}%` }}>
// 															<div>
// 																<select
// 																	name=""
// 																	id=""
// 																	value={th === "R_etc" ? th : ""}
// 																	onChange={(e) => {
// 																		subContents.table_th[trIdx][thIdx] = e.target.value;
// 																		executeChange();
// 																	}}
// 																>
// 																	<option value="">텍스트</option>
// 																	{(th === "R_etc" ||
// 																		subContents.table_th.every((vTr) => vTr.every((vTh) => vTh !== "R_etc"))) && (
// 																		<option value="R_etc">기타</option>
// 																	)}
// 																</select>
// 																{th !== "-" && th !== "R_etc" && (
// 																	<>
// 																		{" "}
// 																		<textarea
// 																			value={th.replace(/<br>/g, "\n")}
// 																			rows={th?.match(/<br>/g)?.length + 1 || 1}
// 																			onChange={(e) => {
// 																				if (e.target.value === "-") return;
// 																				let val = e.target.value.replace(/\n/g, "<br>");
// 																				if (e.target.value === "기타") val = "R_etc";
// 																				subContents.table_th[trIdx][thIdx] = frontStr() + val;
// 																				executeChange();
// 																			}}
// 																		/>
// 																	</>
// 																)}
// 															</div>
// 															{subContents.table_set && (
// 																<>
// 																	size:{" "}
// 																	<input
// 																		type="number"
// 																		value={width || 0}
// 																		onChange={(e) => {
// 																			let num = Number(e.target.value);
// 																			if (num > 0)
// 																				subContents.table_th[trIdx][thIdx] =
// 																					frontStr(undefined, undefined, num) + th;
// 																			else
// 																				subContents.table_th[trIdx][thIdx] =
// 																					frontStr(undefined, undefined, 0) + th;
// 																			executeChange();
// 																		}}
// 																	/>
// 																	%{/* 열 추가삭제 */}
// 																	<br />
// 																	↓합치기:{" "}
// 																	<input
// 																		type="number"
// 																		value={rowSpan || 0}
// 																		onChange={(e) => {
// 																			let num = Number(e.target.value);
// 																			if (!combineCheck(num, undefined, trIdx, thIdx)) {
// 																				dispatch({
// 																					type: "modal/on_modal_alert",
// 																					payload: `합칠 행이 존재하지 않습니다.`,
// 																				});
// 																				return;
// 																			}
// 																			if (num > rowSpan) combine(num, undefined, trIdx, thIdx);
// 																			else combineCancel(num, undefined, trIdx, thIdx);
// 																			// 자기 자신 바꾸기
// 																			if (num > 0) subContents.table_th[trIdx][thIdx] = frontStr(num) + th;
// 																			else subContents.table_th[trIdx][thIdx] = frontStr(0) + th;
// 																			executeChange();
// 																		}}
// 																	/>
// 																	<br />
// 																	→합치기:{" "}
// 																	<input
// 																		type="number"
// 																		value={colSpan || 0}
// 																		onChange={(e) => {
// 																			let num = Number(e.target.value);
// 																			if (!combineCheck(undefined, num, trIdx, thIdx)) {
// 																				dispatch({
// 																					type: "modal/on_modal_alert",
// 																					payload: `합칠 열이 존재하지 않습니다.`,
// 																				});
// 																				return;
// 																			}
// 																			if (num > colSpan) combine(undefined, num, trIdx, thIdx);
// 																			else combineCancel(undefined, num, trIdx, thIdx);
// 																			// 자기 자신 바꾸기
// 																			if (num > 0)
// 																				subContents.table_th[trIdx][thIdx] = frontStr(undefined, num) + th;
// 																			else subContents.table_th[trIdx][thIdx] = frontStr(undefined, 0) + th;
// 																			executeChange();
// 																		}}
// 																	/>
// 																</>
// 															)}
// 														</th>
// 													);
// 												}
// 												if (trIdx === 0 && thIdx === tr.length - 1) {
// 													eleList.push(
// 														<th
// 															key={"thPlus" + thIdx}
// 															style={{ width: "1%", backgroundColor: "transparent", border: "none" }}
// 															// rowSpan={trArr.length}
// 														>
// 															<div style={{ position: "absolute", right: "5px", top: "0" }}>
// 																<button
// 																	className="admin-plma"
// 																	onClick={(e) => {
// 																		const list = subContents.table_th.slice(0);
// 																		for (let i = 0; i < list.length; i++) {
// 																			if (!list[i]) list.push([""]);
// 																			for (let j = 0; j < thIdx + 2; j++) {
// 																				if (list[i][j] == undefined) {
// 																					list[i][j] = "";
// 																				}
// 																			}
// 																		}
// 																		subContents.table_th = list;
// 																		executeChange();
// 																	}}
// 																>
// 																	열+
// 																</button>{" "}
// 																{thArr.length >= 2 && (
// 																	<>
// 																		<button
// 																			className="admin-plma red"
// 																			onClick={(e) => {
// 																				let result = true;
// 																				// 테이블 제목
// 																				const list = [...subContents.table_th];
// 																				for (let i = 0; i < list.length; i++) {
// 																					if (list[i][list[i].length - 1] === "-") {
// 																						result = false;
// 																						break;
// 																					}
// 																				}
// 																				if (!result) {
// 																					dispatch({
// 																						type: "modal/on_modal_alert",
// 																						payload: `해당 끝 열에 합쳐진 열을 풀고 진행해주세요.`,
// 																					});
// 																					return;
// 																				}
// 																				list.map((v) => v.pop());
// 																				subContents.table_th = list;
// 																				executeChange();
// 																			}}
// 																		>
// 																			열-
// 																		</button>
// 																	</>
// 																)}
// 															</div>
// 														</th>
// 													);
// 												} else if (trIdx > 0 && thIdx === tr.length - 1) {
// 													eleList.push(
// 														<th key={"thPlus" + thIdx} style={{ backgroundColor: "transparent", border: "none" }}></th>
// 													);
// 												}
// 												return eleList;
// 											})}
// 									</tr>
// 								);
// 							})}
// 						<tr>
// 							<th
// 								style={{ backgroundColor: "transparent", border: "none" }}
// 								colSpan={subContents?.table_th && subContents?.table_th[0].length}
// 							>
// 								<button
// 									className="admin-plma"
// 									onClick={(e) => {
// 										const list = [...subContents.table_th];
// 										list.push(new Array(list[0].length).fill(""));
// 										subContents.table_th = list;
// 										executeChange();
// 									}}
// 								>
// 									행+
// 								</button>{" "}
// 								{subContents.table_th?.length >= 2 && (
// 									<button
// 										className="admin-plma red"
// 										onClick={(e) => {
// 											const list = subContents.table_th.slice(0);
// 											if (list[list.length - 1].some((v) => v === "-")) {
// 												dispatch({ type: "modal/on_modal_alert", payload: `끝 행의 합쳐진 행을 풀고 진행해주세요.` });
// 												return;
// 											}
// 											list.pop();
// 											subContents.table_th = list;
// 											executeChange();
// 										}}
// 									>
// 										행-
// 									</button>
// 								)}
// 							</th>
// 						</tr>
// 					</thead>
// 				</table>
// 			</div>
// 			<div className="admin-td" style={{ position: "relative" }}>
// 				<h4>
// 					테이블내용
// 					<span className="c_red"> * 디자인종류: 가운데정렬, 가운데정렬+Bold, Bold</span>
// 				</h4>
// 				<table className="tbl_style1">
// 					<tbody className="admin-tbody">
// 						{subContents.table_td?.map((tr, trIdx, trArr) => {
// 							const key = "tr" + trIdx;
// 							return (
// 								<tr key={key}>
// 									{tr.map((td, tdIdx, tdArr) => {
// 										const key2 = "td" + tdIdx;
// 										let commonAttr = {};
// 										let rowSpan = 0;
// 										let colSpan = 0;
// 										let design = 0;

// 										// td 첫 문자열(속성적용용)
// 										const frontStr = (rs, cs) => {
// 											let rowSpanV = rs == 0 ? 0 : rs || rowSpan;
// 											let colSpanV = cs == 0 ? 0 : cs || colSpan;
// 											return `${rowSpanV ? "$rowSpan" + rowSpanV + "|" : ""}${colSpanV ? "$colSpan" + colSpanV + "|" : ""}${
// 												design === 1 ? "$center|" : ""
// 											}${design === 2 ? "$cenBold|" : ""}${design === 3 ? "$bold|" : ""}`;
// 										};
// 										// 합치기 가능한지 검사
// 										const combineCheck = (rs, cs, trIndex, tdIndex) => {
// 											let result = true;
// 											let rowSpanV = rs > rowSpan ? rs : rowSpan;
// 											let colSpanV = cs > colSpan ? cs : colSpan;
// 											for (let i = trIndex; i <= trIndex + rowSpanV; i++) {
// 												for (let j = tdIndex; j <= tdIndex + colSpanV; j++) {
// 													if (i == trIndex && j == tdIndex) continue;
// 													if (
// 														subContents.table_td[i] == undefined ||
// 														subContents.table_td[i][j] == undefined ||
// 														subContents.table_td[i][j].startsWith("$rowSpan") ||
// 														subContents.table_td[i][j].startsWith("$colSpan")
// 													) {
// 														result = false;
// 														break;
// 													}
// 													let splitList = subContents.table_td[i][j].split("|");
// 													let cont = splitList[splitList.length - 1];
// 													if (cont !== "$index" && (cont.startsWith("$") || cont.startsWith("R_"))) {
// 														result = false;
// 														break;
// 													}
// 												}
// 												if (!result) break;
// 											}
// 											return result;
// 										};
// 										// 합치기(합치는건 '-'로 만들고 취소시키는건 ''로 만듬)
// 										const combine = (rs, cs, trIndex, tdIndex) => {
// 											let rowSpanV = rs || rowSpan;
// 											let colSpanV = cs || colSpan;
// 											for (let i = trIndex; i <= trIndex + rowSpanV; i++) {
// 												for (let j = tdIndex; j <= tdIndex + colSpanV; j++) {
// 													if (i == trIndex && j == tdIndex) continue;
// 													subContents.table_td[i][j] = "-";
// 												}
// 											}
// 										};
// 										// 합치기 취소
// 										const combineCancel = (rs, cs, trIndex, tdIndex) => {
// 											let rowSpanV = rs > rowSpan ? rs : rowSpan;
// 											let colSpanV = cs > colSpan ? cs : colSpan;
// 											for (let i = trIndex; i <= trIndex + rowSpanV; i++) {
// 												for (let j = tdIndex; j <= tdIndex + colSpanV; j++) {
// 													if (i == trIdx && j == tdIdx) continue;
// 													if (rs != undefined) {
// 														if (i > trIndex + rs) subContents.table_td[i][j] = "";
// 													} else if (cs != undefined) {
// 														if (j > tdIndex + cs) subContents.table_td[i][j] = "";
// 													}
// 												}
// 											}
// 										};

// 										if (td.startsWith("$colSpan")) {
// 											const tdList = td.split("|");
// 											colSpan = Number(tdList[0].replace("$colSpan", ""));
// 											commonAttr.colSpan = colSpan;
// 											commonAttr.className = "align_center f_500";
// 											td = td.replace(tdList[0] + "|", "");
// 										}
// 										if (td.startsWith("$rowSpan")) {
// 											const tdList = td.split("|");
// 											rowSpan = Number(tdList[0].replace("$rowSpan", ""));
// 											commonAttr.rowSpan = rowSpan;
// 											commonAttr.className = "align_center f_500";
// 											td = td.replace(tdList[0] + "|", "");
// 										}
// 										/*  */
// 										if (td.startsWith("$center")) {
// 											commonAttr.className = "align_center";
// 											design = 1;
// 											td = td.replace("$center|", "");
// 										} else if (td.startsWith("$cenBold")) {
// 											commonAttr.className = "align_center f_500";
// 											design = 2;
// 											td = td.replace("$cenBold|", "");
// 										} else if (td.startsWith("$bold")) {
// 											commonAttr.className = "f_500";
// 											design = 3;
// 											td = td.replace("$bold|", "");
// 										}

// 										const eleList = [];
// 										if (td === "-")
// 											eleList.push(
// 												<td key={key2} style={{ width: `${(100 - 6) / tdArr.length}%` }}>
// 													-
// 												</td>
// 											);
// 										else {
// 											eleList.push(
// 												<td key={"td" + tdIdx} style={{ width: `${(100 - 6) / tdArr.length}%` }}>
// 													<div>
// 														<select
// 															name=""
// 															id=""
// 															value={
// 																["R_year", "R_people", "R_won", "R_term", "R_time"].includes(td)
// 																	? "R_resource"
// 																	: td.startsWith("R_") || td.startsWith("$")
// 																	? td
// 																	: ""
// 															}
// 															onChange={(e) => {
// 																let value = e.target.value;
// 																let tdList = subContents.table_td;
// 																let index = 0;
// 																let trLeng = tdList.length;

// 																if (tdList.some((v) => v.some((v2) => v2 === "$totalRow"))) {
// 																	tdList.map((v, i, arr) => {
// 																		v.map((v2, i2, arr2) => {
// 																			tdList[i][i2] = "";
// 																		});
// 																	});
// 																}
// 																if (value === "$totalRow") {
// 																	tdList.map((v, i, arr) => {
// 																		v.map((v2, i2, arr2) => {
// 																			if (i2 === 0) {
// 																				tdList[i][i2] = "비율";
// 																			} else if (i2 === arr2.length - 1) {
// 																				tdList[i][i2] = "$totalRow";
// 																			} else {
// 																				tdList[i][i2] = "R_per";
// 																			}
// 																		});
// 																	});
// 																} else {
// 																	while (tdList[index] && tdList[index][tdIdx] != undefined) {
// 																		if (value === "$total") {
// 																			if (index == trLeng - 1) {
// 																				tdList[index][tdIdx] = value;
// 																			} else {
// 																				tdList[index][tdIdx] = "R_per";
// 																			}
// 																		} else if (
// 																			value !== "R_etc" &&
// 																			(value.startsWith("R_") || value.startsWith("$"))
// 																		) {
// 																			tdList[index][tdIdx] = value;
// 																		} else {
// 																			if (trIdx == index) {
// 																				tdList[index][tdIdx] = value;
// 																			} else if (
// 																				tdList[index][tdIdx] !== "R_etc" &&
// 																				(tdList[index][tdIdx].startsWith("R_") ||
// 																					tdList[index][tdIdx].startsWith("$"))
// 																			) {
// 																				tdList[index][tdIdx] = "";
// 																			}
// 																		}
// 																		index++;
// 																	}
// 																}
// 																executeChange();
// 															}}
// 														>
// 															<option value="">텍스트</option>
// 															{tdIdx === 0 && <option value="$index">번호</option>}
// 															{(td === "R_etc" ||
// 																subContents.table_td.every((vTr) => vTr.every((vTd) => vTd !== "R_etc"))) && (
// 																<option value="R_etc">기타</option>
// 															)}
// 															<option value="R_per">비율</option>
// 															{subContents.table_td.length > 2 && <option value="$total">비율세로합</option>}
// 															{subContents.table_td[trIdx].length > 2 && <option value="$totalRow">비율가로합</option>}
// 															<option value="R_wei">가중치</option>
// 															<option value="R_resource">인적자원</option>
// 															<option value="R_increDecre">증가감소</option>
// 															<option value="R_radio">단일체크</option>
// 															<option value="R_check">다중체크</option>
// 															<option value="R_relCheck">연관체크</option>
// 															<option value="R_relWeight">연관가중치</option>
// 														</select>
// 														{["R_year", "R_people", "R_won", "R_term", "R_time", "R_resource"].includes(td) && (
// 															<>
// 																<select
// 																	name=""
// 																	id=""
// 																	value={td}
// 																	onChange={(e) => {
// 																		subContents.table_td[trIdx][tdIdx] = e.target.value;
// 																		executeChange();
// 																	}}
// 																>
// 																	<option value="R_resource">-선택-</option>
// 																	<option value="R_year">년도</option>
// 																	<option value="R_people">인원</option>
// 																	<option value="R_won">액수</option>
// 																	<option value="R_term">개월</option>
// 																	<option value="R_time">시간</option>
// 																</select>
// 															</>
// 														)}
// 														{trIdx === 0 &&
// 															(td === "R_etc" || (td !== "-" && !td.startsWith("R_") && !td.startsWith("$"))) && (
// 																<>
// 																	{" "}
// 																	<button
// 																		className="btn btn-primary"
// 																		onClick={() => {
// 																			set_modalOn(true);
// 																			set_inputIndex(tdIdx);
// 																		}}
// 																	>
// 																		지문넣기
// 																	</button>
// 																</>
// 															)}
// 													</div>
// 													{subContents.table_set && (
// 														<>
// 															{!td.startsWith("R_") && !td.startsWith("$") && (
// 																<>
// 																	<button
// 																		className="admin-plma"
// 																		onClick={(e) => {
// 																			if (design < 3) design++;
// 																			else design = 0;
// 																			subContents.table_td[trIdx][tdIdx] = frontStr() + td;
// 																			executeChange();
// 																		}}
// 																	>
// 																		design{design ? design : ""}
// 																	</button>
// 																</>
// 															)}
// 															{(td === "R_etc" || td === "$index" || (!td.startsWith("R_") && !td.startsWith("$"))) && (
// 																<>
// 																	<br />
// 																	↓합치기:{" "}
// 																	<input
// 																		type="number"
// 																		value={rowSpan || 0}
// 																		onChange={(e) => {
// 																			let num = Number(e.target.value);
// 																			if (!combineCheck(num, undefined, trIdx, tdIdx)) {
// 																				dispatch({
// 																					type: "modal/on_modal_alert",
// 																					payload: `합칠 행이 존재하지 않습니다.`,
// 																				});
// 																				return;
// 																			}
// 																			if (num > rowSpan) combine(num, undefined, trIdx, tdIdx);
// 																			else combineCancel(num, undefined, trIdx, tdIdx);
// 																			// 자기 자신 바꾸기
// 																			if (num > 0) subContents.table_td[trIdx][tdIdx] = frontStr(num) + td;
// 																			else subContents.table_td[trIdx][tdIdx] = frontStr(0) + td;
// 																			executeChange();
// 																		}}
// 																	/>
// 																	<br />
// 																	→합치기:{" "}
// 																	<input
// 																		type="number"
// 																		value={colSpan || 0}
// 																		onChange={(e) => {
// 																			let num = Number(e.target.value);
// 																			if (!combineCheck(undefined, num, trIdx, tdIdx)) {
// 																				dispatch({
// 																					type: "modal/on_modal_alert",
// 																					payload: `합칠 열이 존재하지 않습니다.`,
// 																				});
// 																				return;
// 																			}
// 																			if (num > colSpan) combine(undefined, num, trIdx, tdIdx);
// 																			else combineCancel(undefined, num, trIdx, tdIdx);
// 																			// 자기 자신 바꾸기
// 																			if (num > 0)
// 																				subContents.table_td[trIdx][tdIdx] = frontStr(undefined, num) + td;
// 																			else subContents.table_td[trIdx][tdIdx] = frontStr(undefined, 0) + td;
// 																			executeChange();
// 																		}}
// 																	/>
// 																</>
// 															)}
// 														</>
// 													)}
// 												</td>
// 											);
// 										}
// 										if (trIdx === 0 && tdIdx === tr.length - 1) {
// 											eleList.push(
// 												<th
// 													key={"tdPlus" + tdIdx}
// 													style={{ width: "1%", backgroundColor: "transparent", border: "none" }}
// 													// rowSpan={trArr.length}
// 												>
// 													<div style={{ position: "absolute", right: "5px", top: "0" }}>
// 														<button
// 															className="admin-plma"
// 															onClick={(e) => {
// 																const list2 = subContents.table_td.slice(0);
// 																for (let i = 0; i < list2.length; i++) {
// 																	if (!list2[i]) list2.push([""]);
// 																	for (let j = 0; j < tdIdx + 2; j++) {
// 																		if (list2[i][j] == undefined) {
// 																			list2[i][j] = "";
// 																		}
// 																	}
// 																}
// 																// 비율가로합 처리
// 																if (list2.some((v) => v.some((v2) => v2 === "$totalRow"))) {
// 																	list2.map((v, i, arr) => {
// 																		v.map((v2, i2, arr2) => {
// 																			list2[i][arr2.length - 2] = "R_per";
// 																			list2[i][arr2.length - 1] = "$totalRow";
// 																		});
// 																	});
// 																}
// 																subContents.table_td = list2;
// 																executeChange();
// 															}}
// 														>
// 															열+
// 														</button>{" "}
// 														{tdArr.length >= 2 && (
// 															<>
// 																<button
// 																	className="admin-plma red"
// 																	onClick={() => {
// 																		let result = true;
// 																		// 테이블 내용
// 																		const list2 = [...subContents.table_td];
// 																		for (let i = 0; i < list2.length; i++) {
// 																			if (list2[i][list2[i].length - 1] === "-") {
// 																				result = false;
// 																				break;
// 																			}
// 																		}
// 																		if (!result) {
// 																			dispatch({
// 																				type: "modal/on_modal_alert",
// 																				payload: `해당 끝 열에 합쳐진 열을 풀고 진행해주세요.`,
// 																			});
// 																			return;
// 																		}
// 																		// 비율가로합 처리
// 																		if (list2.some((v) => v.some((v2) => v2 === "$totalRow"))) {
// 																			if (list2[0].length > 3) {
// 																				list2.map((v) => {
// 																					v.pop();
// 																					v[v.length - 1] = "$totalRow";
// 																				});
// 																			} else {
// 																				list2.map((v, i) => {
// 																					v.pop();
// 																					v.map((_, i2) => {
// 																						list2[i][i2] = "";
// 																					});
// 																				});
// 																			}
// 																		} else {
// 																			list2.map((v) => v.pop());
// 																		}
// 																		subContents.table_td = list2;
// 																		executeChange();
// 																	}}
// 																>
// 																	열-
// 																</button>
// 															</>
// 														)}
// 													</div>
// 												</th>
// 											);
// 										} else if (trIdx > 0 && tdIdx === tr.length - 1) {
// 											eleList.push(
// 												<td
// 													key={"tdPlus" + tdIdx}
// 													style={{ width: "1%", backgroundColor: "transparent", border: "none" }}
// 												></td>
// 											);
// 										}
// 										return eleList;
// 									})}
// 								</tr>
// 							);
// 						})}
// 						{/* <tr>
//               <td
//                 style={{ backgroundColor: "transparent", border: "none" }}
//                 colSpan={subContents?.table_td && subContents?.table_td[0].length}
//               >
//                 <button
//                   className="admin-plma"
//                   onClick={(e) => {
//                     const list = [...subContents.table_td];
//                     const inList = list[list.length - 1].map((v, i, arr) => {
//                       if (v === "$total") {
//                         list[list.length - 1][i] = "R_per";
//                         return "$total";
//                       } else if (v !== "R_etc" && (v.startsWith("R_") || v.startsWith("$"))) {
//                         return v;
//                       } else {
//                         return "";
//                       }
//                     });
//                     list.push(inList);
//                     subContents.table_td = list;
//                     executeChange();
//                   }}
//                 >
//                   행+
//                 </button>{" "}
//                 {subContents.table_td?.length >= 2 && (
//                   <button
//                     className="admin-plma red"
//                     onClick={(e) => {
//                       const list = subContents.table_td.slice(0);
//                       if (list[list.length - 1].some((v) => v === "-")) {
//                         dispatch({ type: "modal/on_modal_alert", payload: `끝 행의 합쳐진 행을 풀고 진행해주세요.` });
//                         return;
//                       }
//                       // 비율 세로합 전용
//                       let totalCheck = list[list.length - 1].indexOf("$total");
//                       if (totalCheck !== -1) {
//                         if (list.length > 3) {
//                           list[list.length - 2][totalCheck] = "$total";
//                         }
//                       }
//                       list.pop();
//                       subContents.table_td = list;
//                       executeChange();
//                     }}
//                   >
//                     행-
//                   </button>
//                 )}
//               </td>
//             </tr> */}
// 					</tbody>
// 				</table>
// 			</div>
// 			<ModalJimoon modalOn={modalOn} set_modalOn={set_modalOn} input_jimoon={input_jimoon} />
// 		</div>
// 	);
// }
