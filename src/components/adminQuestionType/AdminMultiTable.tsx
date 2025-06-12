import React, { useState } from "react";
import { useDispatch } from "react-redux";
import ModalJimoon from "../modal/ModalJimoon";
import { AdminSurveyQuestionProps } from "../../types/survey";
import { MultiTableSubContents, MultiTableTdCell, MultiTableThCell } from "../../types/question";
import MunhangTextarea from "../admin/MunhangTextarea";
import MunhangText from "../admin/MunhangText";

interface MultiTableProps extends AdminSurveyQuestionProps {
	subContents: MultiTableSubContents;
	change_initData: () => Record<string, string>;
}

/*
 * 여러용도테이블
 */
export default function AdminMultiTable({ subContents, R_num, change_initData, munhangsDispatch }: MultiTableProps) {
	const dispatch = useDispatch();

	const t_changeSubcontents = (in_subContents: Partial<MultiTableSubContents>, options?: { deleteKeys?: (keyof MultiTableSubContents)[] }) => {
		const merged = { ...subContents, ...in_subContents };
		if (options?.deleteKeys) {
			for (const key of options.deleteKeys) {
				delete merged[key];
			}
		}

		munhangsDispatch({
			type: "change_q_subcontents",
			R_num,
			subContents: merged,
		});
	};

	/* 엑셀 자동으로 넣기 */
	const [modalOn, set_modalOn] = useState(false);
	const [inputIndex, set_inputIndex] = useState(0);
	// 엑셀 지문넣기
	const input_jimoon = (excelData: string[][]) => {
		const newTable_td = subContents.table_td.map((row) => [...row]); // 깊은 복사

		excelData.forEach((v, i) => {
			// row가 없다면 새로 추가
			if (!newTable_td[i]) {
				newTable_td[i] = new Array(subContents.table_td[0].length).fill("");
			}

			newTable_td[i] = newTable_td[i].map((td, tdIdx) => {
				if (inputIndex === tdIdx) return v[0] === "기타" ? "R_etc" : v[0];
				if (!td) {
					if (i > 0) {
						const value = newTable_td[i - 1][tdIdx];
						if (value === "$total") {
							newTable_td[i - 1][tdIdx] = "R_per";
							return "$total";
						} else if (value !== "R_etc" && (value.startsWith("R_") || value.startsWith("$"))) {
							return value;
						} else {
							return "";
						}
					}
					return "";
				}

				return td;
			});
		});

		t_changeSubcontents({ table_td: newTable_td });
	};

	return (
		<div className="table adminMultiTable">
			<div>
				<button
					tabIndex={-1}
					className={`admin-plma${subContents.topAlert === "weightDoubleFive" ? " red" : ""}`}
					onClick={() =>
						t_changeSubcontents({
							topAlert: subContents.topAlert === "weightDoubleFive" ? undefined : "weightDoubleFive",
						})
					}
				>
					중요도&수행도 알림{subContents.topAlert === "weightDoubleFive" ? "-" : "+"}
				</button>{" "}
				<button
					tabIndex={-1}
					className={`admin-plma${subContents.topAlert instanceof Array ? " red" : ""}`}
					onClick={() =>
						t_changeSubcontents({
							topAlert: subContents.topAlert instanceof Array ? undefined : ["전혀 아님", "아님", "보통", "그러함", "매우 그러함"],
						})
					}
				>
					가중치알림{subContents.topAlert instanceof Array ? "-" : "+"}
				</button>{" "}
				<button
					tabIndex={-1}
					className={`admin-plma${subContents.topAlert === "addDirectly" ? " red" : ""}`}
					onClick={() =>
						t_changeSubcontents({
							topAlert: subContents.topAlert === "addDirectly" ? undefined : "addDirectly",
						})
					}
				>
					알림 직접추가{subContents.topAlert === "addDirectly" ? "-" : "+"}
				</button>
			</div>
			{subContents.topAlert === "addDirectly" && (
				<div>
					알림 내용(HTML) :{" "}
					<MunhangTextarea
						value={subContents.topAlertMent || ""}
						onChange={(value) =>
							t_changeSubcontents({
								topAlertMent: value,
							})
						}
					/>
				</div>
			)}
			<div>
				예시불러오기 :{" "}
				<select
					name=""
					id=""
					className="form-control"
					onChange={(e) => {
						const val = Number(e.target.value);
						const newSubContents: Partial<MultiTableSubContents> = {};
						if (val == 1) {
							newSubContents.table_th = [[""]];
							newSubContents.table_td = [[""]];
						} else if (val == 2) {
							newSubContents.table_th = [["No", "지문 내용", "현재", "향후<br>(1~3년 내)"]];
							newSubContents.table_td = [
								["$index", "내용을 입력해주세요.", "R_per", "R_per"],
								["$index", "내용을 입력해주세요.", "R_per", "R_per"],
								["$index", "내용을 입력해주세요.", "$total", "$total"],
							];
						} else if (val == 3) {
							newSubContents.table_th = [["지문", "교육", "서베이", "총합"]];
							newSubContents.table_td = [
								["지문", "R_per", "R_per", "$totalRow"],
								["지문", "R_per", "R_per", "$totalRow"],
							];
						} else if (val == 4) {
							newSubContents.topAlert = ["전혀 아님", "아님", "보통", "그러함", "매우 그러함"];
							newSubContents.table_th = [["No", "문항", "1", "2", "3", "4", "5"]];
							newSubContents.table_td = [["$index", "문항내용을 입력해주세요.", "R_wei"]];
						} else if (val == 5) {
							newSubContents.topAlert = "weightDoubleFive";
							newSubContents.table_th = [
								[
									"$rowSpan1|No",
									"$rowSpan1|문항내용",
									"$colSpan4|중요도",
									"-",
									"-",
									"-",
									"-",
									"$colSpan4|수행도",
									"-",
									"-",
									"-",
									"-",
								],
								["-", "-", "1", "2", "3", "4", "5", "1", "2", "3", "4", "5"],
							];
							newSubContents.table_td = [["$index", "문항내용을 입력해주세요.", "R_wei", "R_wei"]];
						} else if (val == 6) {
							newSubContents.table_th = [["No", "문항", "인적자원"]];
							newSubContents.table_td = [
								["$index", "문항내용을 입력해주세요.", "R_people"],
								["$index", "문항내용을 입력해주세요.", "R_year"],
								["$index", "문항내용을 입력해주세요.", "R_won"],
								["$index", "문항내용을 입력해주세요.", "R_term"],
								["$index", "문항내용을 입력해주세요.", "R_time"],
								["$index", "문항내용을 입력해주세요.", "R_resource"],
							];
						} else if (val == 7) {
							newSubContents.table_th = [
								["구분", "$width12|1%~5%", "$width12|6%~25%", "$width12|16%~25%", "$width12|26%~50%", "$width12|51이상"],
							];
							newSubContents.table_td = [
								["증가<br>3)번 문항 이동", "R_increDecre"],
								["감소<br>3)번 문항 이동, 해당 인원수(전담 사내강사)", "R_increDecre"],
							];
						} else if (val == 8) {
							newSubContents.table_th = [["No", "항목", "체크"]];
							newSubContents.table_td = [
								["$index", "항목내용을 입력해주세요.", "R_radio"],
								["$index", "항목내용을 입력해주세요.", "R_radio"],
							];
						} else if (val == 9) {
							newSubContents.table_th = [["No", "항목", "체크"]];
							newSubContents.table_td = [
								["$index", "항목내용을 입력해주세요.", "R_check"],
								["$index", "항목내용을 입력해주세요.", "R_check"],
							];
						} else if (val == 10) {
							newSubContents.table_th = [["No", "항목", "활용여부", "효과성"]];
							newSubContents.table_td = [
								["$index", "항목내용을 입력해주세요.", "R_relCheck"],
								["$index", "항목내용을 입력해주세요.", "R_relCheck"],
							];
						} else if (val == 11) {
							newSubContents.table_th = [
								["$rowSpan1|No", "$rowSpan1|항목", "$rowSpan1|체크", "$colSpan4|만족도", "-", "-", "-", "-"],
								["-", "-", "-", "매우<br>낮음", "낮음", "보통", "높음", "매우<br>높음"],
							];
							newSubContents.table_td = [
								["$index", "항목내용을 입력해주세요.", "R_relWeight"],
								["$index", "항목내용을 입력해주세요.", "R_relWeight"],
							];
						}
						t_changeSubcontents(newSubContents, { deleteKeys: ["topAlert", "table_set"] });
					}}
				>
					<option value="1">사용자지정</option>
					<option value="2">비율 세로 계</option>
					<option value="3">비율 가로 계</option>
					<option value="4">가중치</option>
					<option value="5">중요도수행도</option>
					<option value="6">인적자원</option>
					<option value="7">증가감소</option>
					<option value="8">단일선택</option>
					<option value="9">복수선택</option>
					<option value="10">연관체크</option>
					<option value="11">연관가중치</option>
				</select>
				<span className="c_red">* 예시불러오기 시 현재설정 사라짐</span>
			</div>
			{subContents.table_td?.some((tr) => tr.some((td) => td === "R_check")) && (
				<div>
					체크 최대 갯수 설정 :{" "}
					<select
						className="form-control"
						value={subContents.checkType || ""}
						onChange={(e) => {
							const selected = Number(e.target.value);
							let newSubContents: Partial<MultiTableSubContents> = {};
							if (selected === 1) {
								newSubContents = {
									checkType: 1,
									checkLimit: {
										all: 0,
									},
								};
							} else if (selected === 2) {
								newSubContents = {
									checkType: 2,
									checkLimit: {},
								};
								const newInitData = change_initData();
								const checks = Object.keys(newInitData).filter((v) => v.startsWith(`R_${R_num}_`) && v.endsWith(`_che`));
								checks.forEach((v) => {
									if (newSubContents.checkLimit) newSubContents.checkLimit[v] = 0;
								});
							} else if (selected === 3) {
								newSubContents = {
									checkType: 3,
									checkLimit: {
										maxOrder: 1,
									},
								};
							} else {
								t_changeSubcontents({}, { deleteKeys: ["checkType", "checkLimit"] });
								return;
							}
							t_changeSubcontents(newSubContents);
						}}
					>
						<option value="">없음</option>
						<option value="1">전체</option>
						<option value="2">각자</option>
						<option value="3">순위정하기</option>
					</select>
					{subContents.checkType == 1 && subContents.checkLimit && (
						<>
							<MunhangText
								className="form-control"
								placeholder="기본값 최대"
								value={String(subContents.checkLimit.all) || ""}
								onChange={(value) => {
									const check_count = subContents.table_td.reduce((count, tr) => {
										tr.map((td) => {
											if (td === "R_check") count++;
										});
										return count;
									}, 0);
									let targetVal = Number(value.replace(/\D/g, ""));
									if (targetVal <= 0) targetVal = 0;
									if (check_count < targetVal) targetVal = check_count;
									t_changeSubcontents({ checkLimit: { all: targetVal } });
								}}
							/>
						</>
					)}
					{subContents.checkType == 2 && subContents.checkLimit && (
						<>
							{Object.keys(subContents.checkLimit).map((v, i, arr) => (
								<React.Fragment key={"checkLimit" + i}>
									{v} :{" "}
									<MunhangText
										className="form-control"
										placeholder="기본값 1"
										value={String(subContents.checkLimit?.[v]) || ""}
										onChange={(value) => {
											let targetVal = Number(value.replace(/\D/g, ""));
											if (targetVal <= 0) targetVal = 1;
											const check_count = subContents.table_td.length;
											if (check_count < targetVal) targetVal = check_count;
											t_changeSubcontents({ checkLimit: { [v]: targetVal } });
										}}
									/>
									{i !== arr.length - 1 && ", "}
								</React.Fragment>
							))}
						</>
					)}
					{subContents.checkType == 3 && subContents.checkLimit && (
						<>
							<MunhangText
								className="form-control"
								placeholder="기본값 1"
								value={String(subContents.checkLimit.maxOrder) || ""}
								onChange={(value) => {
									let targetVal = Number(value.replace(/\D/g, ""));
									if (targetVal <= 0) targetVal = 0;
									const check_count = subContents.table_td.reduce((count, tr) => {
										tr.map((td) => {
											if (td === "R_check") count++;
										});
										return count;
									}, 0);
									if (check_count < targetVal) targetVal = check_count;
									t_changeSubcontents({ checkLimit: { maxOrder: targetVal } });
								}}
							/>
						</>
					)}
					{(subContents.checkType == 1 || subContents.checkType == 2) && (
						<>
							갯수 필수체크여부
							<input
								id={"requiredCount" + R_num}
								type="checkbox"
								checked={subContents.checkCountrequired || false}
								onChange={() => {
									if (!subContents.checkCountrequired) t_changeSubcontents({ checkCountrequired: true });
									else t_changeSubcontents({}, { deleteKeys: ["checkCountrequired"] });
								}}
							/>
						</>
					)}
				</div>
			)}
			{subContents.table_td?.some((tr) => tr.some((td) => td === "R_relCheck")) && (
				<div>
					연관체크 최대 갯수 설정 :
					<>
						<MunhangText
							className="form-control"
							placeholder="기본값 1개"
							value={String(subContents.relCheckLimit) || ""}
							onChange={(value) => {
								const check_count = subContents.table_td.reduce((count, tr) => {
									tr.map((td) => {
										if (td === "R_relCheck") count++;
									});
									return count;
								}, 0);
								let targetVal = Number(value.replace(/\D/g, ""));
								if (targetVal <= 0) targetVal = 0;
								if (check_count < targetVal) targetVal = check_count;
								if (targetVal) t_changeSubcontents({ relCheckLimit: targetVal });
								else t_changeSubcontents({}, { deleteKeys: ["relCheckLimit"] });
							}}
						/>
					</>
				</div>
			)}
			{subContents.topAlert instanceof Array && (
				<div>
					<h4>가중치알림 텍스트</h4>
					<div className="table">
						<table className="tbl_style1 weight-alert">
							<thead>
								<tr>
									{subContents.topAlert.map((th, thIdx) => (
										<th key={"weightTh" + thIdx}>
											<MunhangText
												value={th}
												style={{ width: "100%" }}
												onChange={(value) => {
													if (Array.isArray(subContents.topAlert)) {
														t_changeSubcontents({
															topAlert: subContents.topAlert.map((v, i) => (i === thIdx ? value : v)),
														});
													}
												}}
											/>
										</th>
									))}
								</tr>
							</thead>
						</table>
					</div>
				</div>
			)}

			<div className="admin-th" style={{ position: "relative" }}>
				<h4>
					테이블제목{" "}
					{!subContents.table_set ? (
						<button tabIndex={-1} className="admin-plma green" onClick={() => t_changeSubcontents({ table_set: true })}>
							사이즈, 합치기, 디자인 설정
						</button>
					) : (
						<button tabIndex={-1} className="admin-plma red" onClick={() => t_changeSubcontents({ table_set: false })}>
							사이즈, 합치기, 디자인 설정 숨기기
						</button>
					)}
				</h4>
				<table className="tbl_style1">
					<thead>
						{subContents.table_th instanceof Array &&
							subContents.table_th?.map((tr, trIdx) => {
								const key = "tr" + trIdx;
								return (
									<tr key={key}>
										{tr instanceof Array &&
											tr.map((th, thIdx, thArr) => {
												const style: { width?: string } = {};
												const attr: { rowSpan?: number; colSpan?: number } = {};
												let rowSpan = 0;
												let colSpan = 0;
												let width = 0;

												const newTableTh = (subContents.table_th as MultiTableThCell[][]).map((row) => [...row]);

												// th 첫 문자열(속성적용용)
												const frontStr = (rs?: number, cs?: number, wid?: number) => {
													const rowSpanV = rs == 0 ? 0 : rs || rowSpan;
													const colSpanV = cs == 0 ? 0 : cs || colSpan;
													const widV = wid == 0 ? 0 : wid || width;
													return `${rowSpanV ? "$rowSpan" + rowSpanV + "|" : ""}${
														colSpanV ? "$colSpan" + colSpanV + "|" : ""
													}${widV ? "$width" + widV + "|" : ""}`;
												};
												// 합치기 가능한지 검사
												const combineCheck = (rs: number = 0, cs: number = 0, trIndex: number, thIndex: number) => {
													let result = true;
													const rowSpanV = rs > rowSpan ? rs : rowSpan;
													const colSpanV = cs > colSpan ? cs : colSpan;
													for (let i = trIndex; i <= trIndex + rowSpanV; i++) {
														for (let j = thIndex; j <= thIndex + colSpanV; j++) {
															if (i == trIndex && j == thIndex) continue;
															if (
																newTableTh[i] == undefined ||
																newTableTh[i][j] == undefined ||
																newTableTh[i][j].startsWith("$rowSpan") ||
																newTableTh[i][j].startsWith("$colSpan")
															) {
																result = false;
																break;
															}
														}
														if (!result) break;
													}
													return result;
												};
												// 합치기(합치는건 '-'로 만들고 취소시키는건 ''로 만듬)
												const combine = (rs: number = 0, cs: number = 0, trIndex: number, thIndex: number) => {
													const rowSpanV = rs || rowSpan;
													const colSpanV = cs || colSpan;

													subContents.table_th = newTableTh.map((row, i) =>
														row.map((cell, j) => {
															if (i >= trIndex && i <= trIndex + rowSpanV && j >= thIndex && j <= thIndex + colSpanV) {
																return i === trIndex && j === thIndex ? cell : "-";
															}
															return cell;
														})
													);
												};
												// 합치기 취소
												const combineCancel = (rs: number = 0, cs: number = 0, trIndex: number, thIndex: number) => {
													const rowSpanV = rs > rowSpan ? rs : rowSpan;
													const colSpanV = cs > colSpan ? cs : colSpan;
													for (let i = trIndex; i <= trIndex + rowSpanV; i++) {
														for (let j = thIndex; j <= thIndex + colSpanV; j++) {
															if (i == trIdx && j == thIdx) continue;
															if (rs != undefined) {
																if (i > trIndex + rs) newTableTh[i][j] = "";
															} else if (cs != undefined) {
																if (j > thIndex + cs) newTableTh[i][j] = "";
															}
														}
													}
													subContents.table_th = newTableTh;
												};

												if (th.startsWith("$rowSpan")) {
													const thList = th.split("|");
													rowSpan = Number(thList[0].replace("$rowSpan", ""));
													attr.rowSpan = rowSpan + 1;
													th = th.replace(thList[0] + "|", "");
												}
												if (th.startsWith("$colSpan")) {
													const thList = th.split("|");
													colSpan = Number(thList[0].replace("$colSpan", ""));
													attr.colSpan = colSpan + 1;
													th = th.replace(thList[0] + "|", "");
												}
												if (th.startsWith("$width")) {
													width = Number(th.split("|")[0].replace("$width", ""));
													style.width = width + "%";
													th = th.replace(th.split("|")[0] + "|", "");
												}

												const eleList = [];
												if (th === "-")
													eleList.push(
														<th key={"th" + thIdx} style={{ width: `${(100 - 6) / thArr.length}%` }}>
															-
														</th>
													);
												else {
													eleList.push(
														<th key={"th" + thIdx} style={{ width: `${(100 - 6) / thArr.length}%` }}>
															<div>
																<select
																	tabIndex={1}
																	value={th === "R_etc" ? th : ""}
																	onChange={(e) => {
																		newTableTh[trIdx][thIdx] = e.target.value;
																		t_changeSubcontents({ table_th: newTableTh });
																	}}
																>
																	<option value="">텍스트</option>
																	{(th === "R_etc" ||
																		newTableTh.every((vTr) => vTr.every((vTh) => vTh !== "R_etc"))) && (
																		<option value="R_etc">기타</option>
																	)}
																</select>
															</div>
															{th !== "-" && th !== "R_etc" && (
																<div>
																	<MunhangTextarea
																		className="test"
																		value={th}
																		onChange={(value) => {
																			if (value === "-") return;
																			if (value === "기타") value = "R_etc";
																			newTableTh[trIdx][thIdx] = frontStr() + value;
																			t_changeSubcontents({ table_th: newTableTh });
																		}}
																	/>
																</div>
															)}
															{subContents.table_set && (
																<>
																	size:{" "}
																	<input
																		type="number"
																		value={width || 0}
																		onChange={(e) => {
																			const num = Number(e.target.value);
																			if (num > 0)
																				newTableTh[trIdx][thIdx] = frontStr(undefined, undefined, num) + th;
																			else newTableTh[trIdx][thIdx] = frontStr(undefined, undefined, 0) + th;
																			t_changeSubcontents({ table_th: newTableTh });
																		}}
																	/>
																	%{/* 열 추가삭제 */}
																	<br />
																	↓합치기:{" "}
																	<input
																		type="number"
																		value={rowSpan || 0}
																		onChange={(e) => {
																			const num = Number(e.target.value);
																			if (!combineCheck(num, undefined, trIdx, thIdx)) {
																				dispatch({
																					type: "modal/on_modal_alert",
																					payload: `합칠 행이 존재하지 않습니다.`,
																				});
																				return;
																			}
																			if (num > rowSpan) combine(num, undefined, trIdx, thIdx);
																			else combineCancel(num, undefined, trIdx, thIdx);
																			// 자기 자신 바꾸기
																			if (num > 0) newTableTh[trIdx][thIdx] = frontStr(num) + th;
																			else newTableTh[trIdx][thIdx] = frontStr(0) + th;
																			t_changeSubcontents({ table_th: newTableTh });
																		}}
																	/>
																	<br />
																	→합치기:{" "}
																	<input
																		type="number"
																		value={colSpan || 0}
																		onChange={(e) => {
																			const num = Number(e.target.value);
																			if (!combineCheck(undefined, num, trIdx, thIdx)) {
																				dispatch({
																					type: "modal/on_modal_alert",
																					payload: `합칠 열이 존재하지 않습니다.`,
																				});
																				return;
																			}
																			if (num > colSpan) combine(undefined, num, trIdx, thIdx);
																			else combineCancel(undefined, num, trIdx, thIdx);
																			// 자기 자신 바꾸기
																			if (num > 0) newTableTh[trIdx][thIdx] = frontStr(undefined, num) + th;
																			else newTableTh[trIdx][thIdx] = frontStr(undefined, 0) + th;
																			t_changeSubcontents({ table_th: newTableTh });
																		}}
																	/>
																</>
															)}
														</th>
													);
												}
												if (trIdx === 0 && thIdx === tr.length - 1) {
													eleList.push(
														<th
															key={"thPlus" + thIdx}
															style={{ width: "1%", backgroundColor: "transparent", border: "none" }}
															// rowSpan={trArr.length}
														>
															<div style={{ position: "absolute", right: "5px", top: "0" }}>
																<button
																	tabIndex={-1}
																	className="admin-plma"
																	onClick={() => {
																		const list = newTableTh.slice(0) as string[][];
																		for (let i = 0; i < list.length; i++) {
																			if (!list[i]) list.push([""]);
																			for (let j = 0; j < thIdx + 2; j++) {
																				if (list[i][j] == undefined) {
																					list[i][j] = "";
																				}
																			}
																		}
																		t_changeSubcontents({ table_th: list });
																	}}
																>
																	열+
																</button>{" "}
																{thArr.length >= 2 && (
																	<>
																		<button
																			tabIndex={-1}
																			className="admin-plma red"
																			onClick={() => {
																				let result = true;
																				// 테이블 제목
																				for (let i = 0; i < newTableTh.length; i++) {
																					if (newTableTh[i][newTableTh[i].length - 1] === "-") {
																						result = false;
																						break;
																					}
																				}
																				if (!result) {
																					dispatch({
																						type: "modal/on_modal_alert",
																						payload: `해당 끝 열에 합쳐진 열을 풀고 진행해주세요.`,
																					});
																					return;
																				}
																				newTableTh.map((v) => v.pop());
																				t_changeSubcontents({ table_th: newTableTh });
																			}}
																		>
																			열-
																		</button>
																	</>
																)}
															</div>
														</th>
													);
												} else if (trIdx > 0 && thIdx === tr.length - 1) {
													eleList.push(
														<th key={"thPlus" + thIdx} style={{ backgroundColor: "transparent", border: "none" }}></th>
													);
												}
												return eleList;
											})}
									</tr>
								);
							})}
						<tr>
							<th
								style={{ backgroundColor: "transparent", border: "none" }}
								colSpan={subContents?.table_th && subContents?.table_th[0].length}
							>
								<button
									tabIndex={-1}
									className="admin-plma"
									onClick={() => {
										const list = [...subContents.table_th] as string[][];
										t_changeSubcontents({
											table_th: [...list, new Array(list[0].length).fill("")],
										});
									}}
								>
									행+
								</button>{" "}
								{subContents.table_th?.length >= 2 && (
									<button
										tabIndex={-1}
										className="admin-plma red"
										onClick={() => {
											const list = subContents.table_th.slice(0) as string[][];
											if (list[list.length - 1].some((v) => v === "-")) {
												dispatch({ type: "modal/on_modal_alert", payload: `끝 행의 합쳐진 행을 풀고 진행해주세요.` });
												return;
											}
											list.pop();
											t_changeSubcontents({ table_th: list });
										}}
									>
										행-
									</button>
								)}
							</th>
						</tr>
					</thead>
				</table>
			</div>
			<div className="admin-td" style={{ position: "relative" }}>
				<h4>
					테이블내용
					<span className="c_red"> * 디자인종류: 가운데정렬, 가운데정렬+Bold, Bold</span>
				</h4>
				<table className="tbl_style1">
					<tbody className="admin-tbody">
						{subContents.table_td?.map((tr, trIdx) => {
							const key = "tr" + trIdx;
							return (
								<tr key={key}>
									{tr.map((td, tdIdx, tdArr) => {
										const key2 = "td" + tdIdx;
										const commonAttr: { colSpan?: number; rowSpan?: number; className?: string } = {};
										let rowSpan = 0;
										let colSpan = 0;
										let design = 0;

										const newTableTd = (subContents.table_td as MultiTableTdCell[][]).map((row) => [...row]);

										// td 첫 문자열(속성적용용)
										const frontStr = (rs?: number, cs?: number) => {
											const rowSpanV = rs == 0 ? 0 : rs || rowSpan;
											const colSpanV = cs == 0 ? 0 : cs || colSpan;
											return `${rowSpanV ? "$rowSpan" + rowSpanV + "|" : ""}${colSpanV ? "$colSpan" + colSpanV + "|" : ""}${
												design === 1 ? "$center|" : ""
											}${design === 2 ? "$cenBold|" : ""}${design === 3 ? "$bold|" : ""}`;
										};
										// 합치기 가능한지 검사
										const combineCheck = (rs: number = 0, cs: number = 0, trIndex: number, tdIndex: number) => {
											let result = true;
											const rowSpanV = rs > rowSpan ? rs : rowSpan;
											const colSpanV = cs > colSpan ? cs : colSpan;
											for (let i = trIndex; i <= trIndex + rowSpanV; i++) {
												for (let j = tdIndex; j <= tdIndex + colSpanV; j++) {
													if (i == trIndex && j == tdIndex) continue;
													if (
														newTableTd[i] == undefined ||
														newTableTd[i][j] == undefined ||
														newTableTd[i][j].startsWith("$rowSpan") ||
														newTableTd[i][j].startsWith("$colSpan")
													) {
														result = false;
														break;
													}
												}
												if (!result) break;
											}
											return result;
										};
										// 합치기(합치는건 '-'로 만들고 취소시키는건 ''로 만듬)
										const combine = (rs: number = 0, cs: number = 0, trIndex: number, tdIndex: number) => {
											const rowSpanV = rs || rowSpan;
											const colSpanV = cs || colSpan;
											for (let i = trIndex; i <= trIndex + rowSpanV; i++) {
												for (let j = tdIndex; j <= tdIndex + colSpanV; j++) {
													if (i == trIndex && j == tdIndex) continue;
													newTableTd[i][j] = "-";
												}
											}
										};
										// 합치기 취소
										const combineCancel = (rs: number = 0, cs: number = 0, trIndex: number, tdIndex: number) => {
											const rowSpanV = rs > rowSpan ? rs : rowSpan;
											const colSpanV = cs > colSpan ? cs : colSpan;
											for (let i = trIndex; i <= trIndex + rowSpanV; i++) {
												for (let j = tdIndex; j <= tdIndex + colSpanV; j++) {
													if (i == trIdx && j == tdIdx) continue;
													if (rs != undefined) {
														if (i > trIndex + rs) newTableTd[i][j] = "";
													} else if (cs != undefined) {
														if (j > tdIndex + cs) newTableTd[i][j] = "";
													}
												}
											}
										};

										if (td.startsWith("$colSpan")) {
											const tdList = td.split("|");
											colSpan = Number(tdList[0].replace("$colSpan", ""));
											commonAttr.colSpan = colSpan;
											commonAttr.className = "align_center f_500";
											td = td.replace(tdList[0] + "|", "");
										}
										if (td.startsWith("$rowSpan")) {
											const tdList = td.split("|");
											rowSpan = Number(tdList[0].replace("$rowSpan", ""));
											commonAttr.rowSpan = rowSpan;
											commonAttr.className = "align_center f_500";
											td = td.replace(tdList[0] + "|", "");
										}
										/*  */
										if (td.startsWith("$center")) {
											commonAttr.className = "align_center";
											design = 1;
											td = td.replace("$center|", "");
										} else if (td.startsWith("$cenBold")) {
											commonAttr.className = "align_center f_500";
											design = 2;
											td = td.replace("$cenBold|", "");
										} else if (td.startsWith("$bold")) {
											commonAttr.className = "f_500";
											design = 3;
											td = td.replace("$bold|", "");
										}

										const eleList = [];
										if (td === "-")
											eleList.push(
												<td key={key2} style={{ width: `${(100 - 6) / tdArr.length}%` }}>
													-
												</td>
											);
										else {
											eleList.push(
												<td key={"td" + tdIdx} style={{ width: `${(100 - 6) / tdArr.length}%` }}>
													<div>
														<select
															tabIndex={1}
															value={
																["R_year", "R_people", "R_won", "R_term", "R_time"].includes(td)
																	? "R_resource"
																	: td.startsWith("R_") || td.startsWith("$")
																	? td
																	: ""
															}
															onChange={(e) => {
																const value = e.target.value;
																const trLeng = newTableTd.length;

																if (newTableTd.some((v) => v.some((v2) => v2 === "$totalRow"))) {
																	newTableTd.map((v, i) => {
																		v.map((_, i2) => {
																			newTableTd[i][i2] = "";
																		});
																	});
																}
																if (value === "$totalRow") {
																	newTableTd.map((v, i) => {
																		v.map((_, i2, arr2) => {
																			if (i2 === 0) {
																				newTableTd[i][i2] = "비율";
																			} else if (i2 === arr2.length - 1) {
																				newTableTd[i][i2] = "$totalRow";
																			} else {
																				newTableTd[i][i2] = "R_per";
																			}
																		});
																	});
																} else if (newTableTd.some((v) => v.some((v2) => v2 === "$total"))) {
																	newTableTd[trIdx][tdIdx] = value;
																} else {
																	let index = 0;
																	while (newTableTd[index] && newTableTd[index][tdIdx] != undefined) {
																		if (value === "$total") {
																			if (index == trLeng - 1) {
																				newTableTd[index][tdIdx] = value;
																			} else {
																				newTableTd[index][tdIdx] = "R_per";
																			}
																		} else if (
																			value !== "R_etc" &&
																			(value.startsWith("R_") || value.startsWith("$"))
																		) {
																			newTableTd[index][tdIdx] = value;
																		} else {
																			if (trIdx == index) {
																				newTableTd[index][tdIdx] = value;
																			} else if (
																				newTableTd[index][tdIdx] !== "R_etc" &&
																				(newTableTd[index][tdIdx].startsWith("R_") ||
																					newTableTd[index][tdIdx].startsWith("$"))
																			) {
																				newTableTd[index][tdIdx] = "";
																			}
																		}
																		index++;
																	}
																}
																t_changeSubcontents({ table_td: newTableTd });
															}}
														>
															<option value="">텍스트</option>
															{tdIdx === 0 && <option value="$index">번호</option>}
															{(td === "R_etc" ||
																subContents.table_td.every((vTr) => vTr.every((vTd) => vTd !== "R_etc"))) && (
																<option value="R_etc">기타</option>
															)}
															<option value="R_per">비율</option>
															{subContents.table_td.length > 2 && <option value="$total">비율세로합</option>}
															{subContents.table_td[trIdx].length > 2 && <option value="$totalRow">비율가로합</option>}
															<option value="R_wei">가중치</option>
															<option value="R_resource">인적자원</option>
															<option value="R_increDecre">증가감소</option>
															<option value="R_increDecre2">증가감소2</option>
															<option value="R_radio">단일체크</option>
															<option value="R_check">다중체크</option>
															<option value="R_relCheck">연관체크</option>
															<option value="R_relWeight">연관가중치</option>
														</select>
														{["R_year", "R_people", "R_won", "R_term", "R_time", "R_resource"].includes(td) && (
															<>
																<select
																	name=""
																	id=""
																	value={td}
																	onChange={(e) => {
																		newTableTd[trIdx][tdIdx] = e.target.value;
																		t_changeSubcontents({ table_td: newTableTd });
																	}}
																>
																	<option value="R_resource">-선택-</option>
																	<option value="R_year">년도</option>
																	<option value="R_people">인원</option>
																	<option value="R_won">액수</option>
																	<option value="R_term">개월</option>
																	<option value="R_time">시간</option>
																</select>
															</>
														)}
														{trIdx === 0 &&
															(td === "R_etc" || (td !== "-" && !td.startsWith("R_") && !td.startsWith("$"))) && (
																<>
																	{" "}
																	<button
																		tabIndex={-1}
																		className="btn btn-primary"
																		onClick={() => {
																			set_modalOn(true);
																			set_inputIndex(tdIdx);
																		}}
																	>
																		지문넣기
																	</button>
																</>
															)}
													</div>
													{td !== "-" && !td.startsWith("R_") && !td.startsWith("$") && (
														<div>
															{" "}
															<MunhangTextarea
																value={td}
																onChange={(value) => {
																	if (value === "-") return;
																	if (value === "$") return;
																	if (value === "R_") return;
																	if (value === "기타") value = "R_etc";
																	newTableTd[trIdx][tdIdx] = frontStr() + value;
																	t_changeSubcontents({ table_td: newTableTd });
																}}
															/>
														</div>
													)}
													{subContents.table_set && (
														<>
															{!td.startsWith("R_") && !td.startsWith("$") && (
																<>
																	<button
																		tabIndex={-1}
																		className="admin-plma"
																		onClick={() => {
																			if (design < 3) design++;
																			else design = 0;
																			newTableTd[trIdx][tdIdx] = frontStr() + td;
																			t_changeSubcontents({ table_td: newTableTd });
																		}}
																	>
																		design{design ? design : ""}
																	</button>
																</>
															)}
															{(td === "R_etc" || td === "$index" || (!td.startsWith("R_") && !td.startsWith("$"))) && (
																<>
																	<br />
																	↓합치기:{" "}
																	<input
																		type="number"
																		value={rowSpan || 0}
																		onChange={(e) => {
																			const num = Number(e.target.value);
																			if (!combineCheck(num, undefined, trIdx, tdIdx)) {
																				dispatch({
																					type: "modal/on_modal_alert",
																					payload: `합칠 행이 존재하지 않습니다.`,
																				});
																				return;
																			}
																			if (num > rowSpan) combine(num, undefined, trIdx, tdIdx);
																			else combineCancel(num, undefined, trIdx, tdIdx);
																			// 자기 자신 바꾸기
																			if (num > 0) newTableTd[trIdx][tdIdx] = frontStr(num) + td;
																			else newTableTd[trIdx][tdIdx] = frontStr(0) + td;
																			t_changeSubcontents({ table_td: newTableTd });
																		}}
																	/>
																	<br />
																	→합치기:{" "}
																	<input
																		type="number"
																		value={colSpan || 0}
																		onChange={(e) => {
																			const num = Number(e.target.value);
																			if (!combineCheck(undefined, num, trIdx, tdIdx)) {
																				dispatch({
																					type: "modal/on_modal_alert",
																					payload: `합칠 열이 존재하지 않습니다.`,
																				});
																				return;
																			}
																			if (num > colSpan) combine(undefined, num, trIdx, tdIdx);
																			else combineCancel(undefined, num, trIdx, tdIdx);
																			// 자기 자신 바꾸기
																			if (num > 0) newTableTd[trIdx][tdIdx] = frontStr(undefined, num) + td;
																			else newTableTd[trIdx][tdIdx] = frontStr(undefined, 0) + td;
																			t_changeSubcontents({ table_td: newTableTd });
																		}}
																	/>
																</>
															)}
														</>
													)}
												</td>
											);
										}
										if (trIdx === 0 && tdIdx === tr.length - 1) {
											eleList.push(
												<th
													key={"tdPlus" + tdIdx}
													style={{ width: "1%", backgroundColor: "transparent", border: "none" }}
													// rowSpan={trArr.length}
												>
													<div style={{ position: "absolute", right: "5px", top: "0" }}>
														<button
															className="admin-plma"
															tabIndex={-1}
															onClick={() => {
																const list2 = newTableTd.slice(0);
																for (let i = 0; i < list2.length; i++) {
																	if (!list2[i]) list2.push([""]);
																	for (let j = 0; j < tdIdx + 2; j++) {
																		if (list2[i][j] == undefined) {
																			list2[i][j] = "";
																		}
																	}
																}
																// 비율가로합 처리
																if (list2.some((v) => v.some((v2) => v2 === "$totalRow"))) {
																	list2.map((v, i) => {
																		v.map((_, _2, arr2) => {
																			list2[i][arr2.length - 2] = "R_per";
																			list2[i][arr2.length - 1] = "$totalRow";
																		});
																	});
																}
																subContents.table_td = list2;
																t_changeSubcontents({ table_td: list2 });
															}}
														>
															열+
														</button>{" "}
														{tdArr.length >= 2 && (
															<>
																<button
																	tabIndex={-1}
																	className="admin-plma red"
																	onClick={() => {
																		let result = true;
																		// 테이블 내용
																		for (let i = 0; i < newTableTd.length; i++) {
																			if (newTableTd[i][newTableTd[i].length - 1] === "-") {
																				result = false;
																				break;
																			}
																		}
																		if (!result) {
																			dispatch({
																				type: "modal/on_modal_alert",
																				payload: `해당 끝 열에 합쳐진 열을 풀고 진행해주세요.`,
																			});
																			return;
																		}
																		// 비율가로합 처리
																		if (newTableTd.some((v) => v.some((v2) => v2 === "$totalRow"))) {
																			if (newTableTd[0].length > 3) {
																				newTableTd.map((v) => {
																					v.pop();
																					v[v.length - 1] = "$totalRow";
																				});
																			} else {
																				newTableTd.map((v, i) => {
																					v.pop();
																					v.map((_, i2) => {
																						newTableTd[i][i2] = "";
																					});
																				});
																			}
																		} else {
																			newTableTd.map((v) => v.pop());
																		}
																		t_changeSubcontents({ table_td: newTableTd });
																	}}
																>
																	열-
																</button>
															</>
														)}
													</div>
												</th>
											);
										} else if (trIdx > 0 && tdIdx === tr.length - 1) {
											eleList.push(
												<td
													key={"tdPlus" + tdIdx}
													style={{ width: "1%", backgroundColor: "transparent", border: "none" }}
												></td>
											);
										}
										return eleList;
									})}
								</tr>
							);
						})}
						<tr>
							<td
								style={{ backgroundColor: "transparent", border: "none" }}
								colSpan={subContents?.table_td && subContents?.table_td[0].length}
							>
								<button
									tabIndex={-1}
									className="admin-plma"
									onClick={() => {
										const newTableTd = (subContents.table_td as MultiTableTdCell[][]).map((row) => [...row]);
										const inList = newTableTd[newTableTd.length - 1].map((v, i) => {
											if (v === "$total") {
												newTableTd[newTableTd.length - 1][i] = "R_per";
												return "$total";
											} else if (v !== "R_etc" && (v.startsWith("R_") || v.startsWith("$"))) {
												return v;
											} else {
												return "";
											}
										});
										newTableTd.push(inList);
										t_changeSubcontents({ table_td: newTableTd });
									}}
								>
									행+
								</button>{" "}
								{subContents.table_td?.length >= 2 && (
									<button
										tabIndex={-1}
										className="admin-plma red"
										onClick={() => {
											const list = subContents.table_td.slice(0);
											if (list[list.length - 1].some((v) => v === "-")) {
												dispatch({ type: "modal/on_modal_alert", payload: `끝 행의 합쳐진 행을 풀고 진행해주세요.` });
												return;
											}
											// 비율 세로합 전용 START
											const totalCheck: number[] = list[list.length - 1].reduce((acc: number[], cur, i) => {
												if (cur === "$total") {
													acc.push(i);
												}
												return acc;
											}, []);
											if (totalCheck.length > 0) {
												if (list.length > 3) {
													totalCheck.map((v) => {
														list[list.length - 2][v] = "$total";
													});
												}
											}
											// 비율 세로합 전용 END
											list.pop();
											t_changeSubcontents({ table_td: list });
										}}
									>
										행-
									</button>
								)}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<ModalJimoon modalOn={modalOn} set_modalOn={set_modalOn} input_jimoon={input_jimoon} />
		</div>
	);
}
