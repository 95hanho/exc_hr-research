import React from "react";
import { useDispatch } from "react-redux";
import { SurveyQuestionProps } from "../../types/survey";
import { MultiTableSubContents, MultiTableTdCell, MultiTableThCell } from "../../types/question";

interface MultiTableProps extends SurveyQuestionProps {
	subContents: MultiTableSubContents;
}

/*
 * 여러용도테이블
 */
export default function MultiTable({ subContents, resultData, changeResultData, R_num }: MultiTableProps) {
	const dispatch = useDispatch();

	const fiveAsc = Array.from(Array(5).keys(), (i) => i + 1);
	const totalExist: Record<string, number> = {};

	const numberFilter = (targetVal: string, min: number, max: number | bigint, trIdx?: number, tdIdx?: number) => {
		let targetNum: number | bigint = Number(targetVal.replace(/\D/g, ""));
		let total = 0;
		let leng = 0;
		/* 비율 전체 합 값 조절 */
		if (typeof tdIdx === "number" && typeof trIdx === "number") {
			if (totalExist[`R_${R_num}_n_${tdIdx + 1}`] !== undefined) {
				leng = Number(totalExist[`R_${R_num}_n_${tdIdx + 1}`]);
				const name = `R_${R_num}_n_${tdIdx + 1}`;
				let cur = null;
				for (let i = 1; i <= leng; i++) {
					if ((cur = resultData[name.replace("n", i + "")]) !== undefined && i !== trIdx + 1) {
						total += Number(cur);
					}
				}
				if (total + targetNum > 100) {
					targetNum = 100 - total;
				}
			} else if (totalExist[`R_${R_num}_${trIdx + 1}_n`] !== undefined) {
				leng = totalExist[`R_${R_num}_${trIdx + 1}_n`];
				const name = `R_${R_num}_${trIdx + 1}_n`;
				let cur = null;
				for (let i = 1; i <= leng; i++) {
					if ((cur = resultData[name.replace("n", i + "")]) !== undefined && i !== tdIdx + 1) {
						total += Number(cur);
					}
				}
				if (total + targetNum > 100) {
					targetNum = 100 - total;
				}
			}
		}

		/* 비율 전체 합 값 조절 */
		if (targetNum < min) targetNum = min;
		if (targetNum > max) targetNum = max;

		if (typeof targetNum === "bigint") {
			return targetNum.toString();
		} else {
			return targetNum.toString();
		}
	};
	const disabledCalc = (trIdx: number, tdIdx: number) => {
		if (resultData[`R_${R_num}_th_${tdIdx + 1}_etc`] != undefined && resultData[`R_${R_num}_th_${tdIdx + 1}_etc`] === "") return true;
		if (resultData[`R_${R_num}_${trIdx + 1}_etc`] != undefined && resultData[`R_${R_num}_${trIdx + 1}_etc`] === "") return true;
		return false;
	};
	// 해당없음 name 리턴
	const noHedang = (trArr: MultiTableTdCell[][]) => {
		for (let trIdx = 0; trIdx < trArr.length; trIdx++) {
			const row = trArr[trIdx];
			for (let i = 0; i < row.length; i++) {
				if (row[i].replace(/\s/g, "").startsWith("해당없음")) {
					return trIdx;
				}
			}
		}
		return null;
	};

	return (
		<div className="table">
			{subContents.topAlert === "weightDoubleFive" && (
				<>
					<div className="alert bg-info">
						<p className="alert_txt1">
							<strong>* 중요도: 귀사(기관)에서 가장 중요하다고 생각되는 활동의 수준</strong>
						</p>
						<p className="alert_txt2">① 별로 중요하지 않다 ② 약간 중요하다 ③ 중요한 편이다 ④ 꽤 중요하다 ⑤ 매우 중요하다</p>
						<p className="alert_txt1">
							<strong>* 수행도: 귀사(기관)에서 현재 수행하고 있는 활동의 수준</strong>
						</p>
						<p className="alert_txt2">① 별로 그렇지 않다 ② 약간 그렇다 ③ 그런 편이다 ④ 꽤 그렇다 ⑤ 매우 그렇다</p>
					</div>
					<br />
				</>
			)}
			{subContents.topAlert instanceof Array && (
				<div className="table">
					<table className="tbl_style1 weight-alert">
						<thead>
							<tr>
								{subContents.topAlert.map((th, thIdx) => (
									<th key={"weightTh" + thIdx}>{th}</th>
								))}
							</tr>
						</thead>
						<tbody>
							<tr>
								<td className="text-center">1</td>
								<td className="text-center">2</td>
								<td className="text-center">3</td>
								<td className="text-center">4</td>
								<td className="text-center">5</td>
							</tr>
						</tbody>
					</table>
				</div>
			)}
			{subContents.topAlert === "addDirectly" && (
				<>
					<div
						dangerouslySetInnerHTML={{
							__html: subContents.topAlertMent || "",
						}}
					></div>
				</>
			)}
			<table className={"tbl_style1 checkTable"}>
				<thead>
					{subContents.table_th instanceof Array ? (
						(() => {
							const trThEles: React.ReactNode[][] = [];
							const thEles: React.ReactNode[] = [];
							subContents.table_th.map((th, thIdx) => {
								if (th instanceof Array) {
									trThEles.push(th.map((th2, th2Idx) => thMaking(th2, th2Idx)));
								} else {
									thEles.push(thMaking(th, thIdx));
								}
								function thMaking(th: MultiTableThCell, thIdx: number): React.ReactNode {
									if (th === "-") return;

									const attr: { rowSpan?: number; colSpan?: number } = {
										// key: "table_th" + thIdx,
									};
									const style: { width?: string } = {};

									if (th.startsWith("$rowSpan")) {
										const thList = th.split("|");
										const rowSpan = Number(thList[0].replace("$rowSpan", ""));
										attr.rowSpan = rowSpan + 1;
										th = th.replace(thList[0] + "|", "");
									}
									if (th.startsWith("$colSpan")) {
										const thList = th.split("|");
										const colSpan = Number(thList[0].replace("$colSpan", ""));
										attr.colSpan = colSpan + 1;
										th = th.replace(thList[0] + "|", "");
									}
									if (th.startsWith("$width")) {
										const width = Number(th.split("|")[0].replace("$width", ""));
										style.width = width + "%";
										th = th.replace(th.split("|")[0] + "|", "");
									}

									if (th === "R_etc") {
										const disabledList = Object.keys(resultData).filter(
											(v) => v.startsWith(`R_${R_num}_`) && v.endsWith(`_${thIdx + 1}`)
										);
										return (
											<th {...attr} {...style}>
												기타
												<input
													type="text"
													name={`R_${R_num}_th_${thIdx + 1}_etc`}
													className="form-control"
													maxLength={35}
													value={resultData[`R_${R_num}_th_${thIdx + 1}_etc`] || ""}
													onChange={(e) => {
														if (disabledList.length > 0 && !e.target.value) {
															const obj = disabledList.reduce((acc: Record<string, string>, cur) => {
																acc[cur] = "";
																return acc;
															}, {});
															changeResultData(e, obj);
														} else changeResultData(e);
													}}
												></input>
											</th>
										);
									} else if (th === "$weight") {
										return fiveAsc.map((num) => <th key={"$weight" + num}>{num}</th>);
									} else {
										return (
											<th
												{...attr}
												{...style}
												dangerouslySetInnerHTML={{
													__html: th,
												}}
											></th>
										);
									}
								}
							});
							if (trThEles.length > 0) {
								return (
									<>
										{trThEles.map((eles, elesIdx) => (
											<tr key={"ele" + elesIdx}>
												{eles.map((ele, eleIdx) => (
													<React.Fragment key={"ele" + eleIdx}>{ele}</React.Fragment>
												))}
											</tr>
										))}
									</>
								);
							} else if (thEles.length > 0) {
								return (
									<tr>
										{thEles.map((thEle, thEleIdx) => (
											<React.Fragment key={"thEle" + thEleIdx}>{thEle}</React.Fragment>
										))}
									</tr>
								);
							}
						})()
					) : (
						<>
							{subContents.table_th === "weightDoubleFive" && (
								<>
									<tr>
										<th rowSpan={2}>No</th>
										<th rowSpan={2}>집합교육</th>
										<th colSpan={5}>중요도</th>
										<th colSpan={5}>수행도</th>
									</tr>
									<tr>
										<th>①</th>
										<th>②</th>
										<th>③</th>
										<th>④</th>
										<th>⑤</th>
										<th>①</th>
										<th>②</th>
										<th>③</th>
										<th>④</th>
										<th>⑤</th>
									</tr>
								</>
							)}
							{subContents.table_th === "increaseDecrease" && (
								<tr>
									<th>구분</th>
									<th style={{ width: "12%" }}>1%~5%</th>
									<th style={{ width: "12%" }}>6%~15%</th>
									<th style={{ width: "12%" }}>16%~25%</th>
									<th style={{ width: "12%" }}>26%~50%</th>
									<th style={{ width: "12%" }}>51% 이상</th>
								</tr>
							)}
						</>
					)}
				</thead>
				<tbody>
					{(() => {
						let indexNum = 0;
						return subContents?.table_td?.map((tr, trIdx, trArr) => {
							return (
								<tr key={"tr" + R_num + trIdx}>
									{tr.map((td, tdIdx, tdArr) => {
										if (td === "-") return;
										const inEles: React.ReactNode[] = [];
										const tdKey = "td" + tdIdx;
										// 공통으로 넣을 속성
										const commonAttr: {
											colSpan?: number;
											rowSpan?: number;
											className?: string;
											style?: React.CSSProperties;
										} = {};
										// 커스텀 속성
										const customAttr: Record<
											string,
											{
												colSpan?: number;
												rowSpan?: number;
												className?: string;
												style?: React.CSSProperties;
											}
										> = {};
										if (td.startsWith("$colSpan")) {
											const tdList = td.split("|");
											const colSpan = Number(tdList[0].replace("$colSpan", ""));
											commonAttr.colSpan = colSpan + 1;
											commonAttr.className = "align_center f_500";
											td = td.replace(tdList[0] + "|", "");
										}
										if (td.startsWith("$rowSpan")) {
											const tdList = td.split("|");
											const rowSpan = Number(tdList[0].replace("$rowSpan", ""));
											commonAttr.rowSpan = rowSpan + 1;
											commonAttr.className = "align_center f_500";
											td = td.replace(tdList[0] + "|", "");
										}
										/*  */
										if (td.startsWith("$center")) {
											commonAttr.className = "align_center";
											td = td.replace("$center|", "");
										} else if (td.startsWith("$cenBold")) {
											commonAttr.className = "align_center f_500";
											td = td.replace("$cenBold|", "");
										} else if (td.startsWith("$bold")) {
											commonAttr.className = "f_500";
											td = td.replace("$bold|", "");
										}

										if (td === "$index") {
											indexNum++;
											return (
												<th key={tdKey} {...commonAttr}>
													{indexNum}
												</th>
											);
										} else {
											if (td === "R_wei") {
												const name = `R_${R_num}_${trIdx + 1}_${tdIdx + 1}`;
												const disabled = disabledCalc(trIdx, tdIdx);
												commonAttr.className = "text-center weight-td";
												if (tdArr[tdIdx - 1] === "R_wei") {
													commonAttr.className += " wei-bold";
												}
												fiveAsc.map((num) => {
													inEles.push(
														<>
															<input
																id={`${name}_${num}`}
																type="radio"
																name={name}
																value={num}
																className="weight-radio"
																checked={resultData[name] == num + ""}
																onChange={(e) => changeResultData(e)}
																disabled={disabled}
															/>
															<label htmlFor={`${name}_${num}`}></label>
														</>
													);
												});
											} else if (td === "R_increDecre") {
												const name = `R_${R_num}_n_${tdIdx + 1}`;
												commonAttr.className = "text-center weight-td";
												fiveAsc.map((_, idx) => {
													inEles.push(
														<>
															<input
																id={`${name}_${trIdx * 5 + idx + 1}`}
																type="radio"
																name={name}
																value={trIdx * 5 + idx + 1}
																className="weight-radio"
																checked={resultData[name] == String(trIdx * 5 + idx + 1)}
																onChange={(e) => changeResultData(e)}
															/>
															<label htmlFor={`${name}_${trIdx * 5 + idx + 1}`}></label>
														</>
													);
												});
											} else if (td === "R_increDecre2") {
												const name = `R_${R_num}_n_${tdIdx + 1}`;
												commonAttr.className = "text-center weight-td";
												const idIdx = trIdx * 5;
												const valueUp = Math.floor(trIdx / 2);
												const isZero = trIdx % 2 == 0;
												if (isZero) {
													customAttr[idIdx] = {
														rowSpan: 2,
													};
													const value = String(valueUp + idIdx + 1);
													inEles.push(
														<>
															<input
																id={`${name}_${value}`}
																type="radio"
																name={name}
																value={value}
																className="weight-radio"
																checked={resultData[name] == value}
																onChange={(e) => changeResultData(e)}
															/>
															<label htmlFor={`${name}_${idIdx + 1}`}></label>
														</>
													);
												}
												fiveAsc.map((_, idx) => {
													const cIdx = idx + valueUp + 1;
													const value = String(idIdx + cIdx + 1);
													inEles.push(
														<>
															<input
																id={`${name}_${value}`}
																type="radio"
																name={name}
																value={value}
																className="weight-radio"
																checked={resultData[name] == value}
																onChange={(e) => changeResultData(e)}
															/>
															<label htmlFor={`${name}_${value}`}></label>
														</>
													);
												});
											} else if (td === "R_per") {
												const name = `R_${R_num}_${trIdx + 1}_${tdIdx + 1}`;
												const disabled = disabledCalc(trIdx, tdIdx);
												commonAttr.className = "text-right";
												commonAttr.style = { padding: 0 };
												let per_class = "";
												if (trArr[trArr.length - 1][tdIdx] === "$total") {
													if (trIdx === trArr.length - 2) per_class = "total end";
													else per_class = "total";
												} else if (trArr[trIdx][tdArr.length - 1] === "$totalRow") {
													if (tdIdx === tdArr.length - 2) per_class = "totalRow end";
													else per_class = "totalRow";
												}
												inEles.push(
													<>
														<input
															type="text"
															id={name}
															name={name}
															value={resultData[name] != undefined ? resultData[name] : ""}
															onChange={(e) => {
																changeResultData(undefined, {
																	[e.target.name]: numberFilter(e.target.value, 0, 100, trIdx, tdIdx),
																});
															}}
															className={`form-control${per_class ? " " + per_class : ""}`}
															disabled={disabled}
														/>
														%
													</>
												);
											} else if (["R_people", "R_won", "R_time", "R_term"].includes(td)) {
												const name = `R_${R_num}_${trIdx + 1}_${tdIdx + 1}`;
												commonAttr.className = "text-right";
												const lastText = () => {
													switch (td) {
														case "R_people":
															return "명";
														case "R_won":
															return "원";
														case "R_time":
															return "시간";
														case "R_term":
															return "개월";
													}
												};
												inEles.push(
													<>
														<input
															type="text"
															id={name}
															name={name}
															className="form-control"
															value={resultData[name] != undefined ? resultData[name] : ""}
															onChange={(e) => {
																changeResultData(undefined, {
																	[e.target.name]: numberFilter(e.target.value, 0, 99999999999999999n),
																});
															}}
														/>{" "}
														{lastText()}
													</>
												);
											} else if (td === "R_year") {
												const name = `R_${R_num}_${trIdx + 1}_${tdIdx + 1}`;
												const [year = "", month = ""] = String(resultData[name] ?? "").split("-");
												commonAttr.className = "text-right";
												inEles.push(
													<>
														<input
															type="text"
															id={name + "_y"}
															name={name}
															className="form-control"
															value={year}
															maxLength={5}
															onChange={(e) => {
																if (!e.target.value && !month) {
																	changeResultData(undefined, {
																		[name]: "",
																	});
																} else {
																	changeResultData(undefined, {
																		[name]: e.target.value + "-" + month,
																	});
																}
															}}
														/>{" "}
														년
														<input
															type="text"
															id={name + "_m"}
															name={name}
															className="form-control"
															value={month}
															maxLength={5}
															onChange={(e) => {
																if (!e.target.value && !year) {
																	changeResultData(undefined, {
																		[name]: "",
																	});
																} else {
																	changeResultData(undefined, {
																		[name]: year + "-" + e.target.value,
																	});
																}
															}}
														/>{" "}
														개월
													</>
												);
											} else if (td === "R_check") {
												commonAttr.className = "text-center";
												const name = `R_${R_num}_n_${tdIdx + 1}_che`; // 해당 체크 input name
												const data = resultData[name] || ""; // 결과들어간 값
												let list = data === "" ? [] : String(data).split(","); // 결과값 리스트
												const orderName = `R_${R_num}_cheOrder`;
												const orderList: string[] =
													(resultData[orderName] || "") == "" ? [] : String(resultData[`R_${R_num}_cheOrder`]).split(",");
												const beforeIdx = tdIdx - 1 < 0 ? 0 : tdIdx - 1;
												const isEtcInput = tdArr[beforeIdx] == "R_etc" || tdArr[beforeIdx - 1] == "R_etc"; // etc관련 input인지
												const noNameIdx = noHedang(trArr); // 해당 없음 name
												const totalCheckInputCount = subContents.table_td.reduce((count, tr) => {
													tr.map((td) => {
														if (td === "R_check") count++;
													});
													return count;
												}, 0); // 전체 체크 갯수
												const otherCheckData = () =>
													Object.keys(resultData).filter(
														(v) => v.startsWith(`R_${R_num}_n_`) && v.endsWith("_che") && v !== name
													); // 해당 줄 아닌 체크 데이터
												const otherCheckTrueCount = () =>
													otherCheckData().reduce((acc, cur) => {
														const data = resultData[cur] || "";
														const dList = data === "" ? [] : String(data).split(",");
														return acc + dList.length;
													}, 0);

												if (R_num == 1 && noNameIdx) {
													// console.log("noNameIdx", noNameIdx);
													// console.log("td", td, "tdIdx", tdIdx, tdArr[tdIdx - 1]);
													// console.log(tdArr[tdIdx - 1] == "R_etc");
													// console.log("totalCheckCount", totalCheckInputCount);
												}

												inEles.push(
													<>
														{subContents.checkType == 3 &&
															(() => {
																const orderNum = orderList.findIndex((order) => {
																	return order.startsWith(`${trIdx + 1}-${tdIdx + 1}-`);
																});
																// console.log(otherCheckData());
																if (orderNum != -1)
																	return (
																		<span
																			style={{
																				fontSize: "25px",
																				marginRight: "3px",
																				verticalAlign: "top",
																			}}
																		>
																			{orderNum + 1}
																		</span>
																	);
															})()}

														<input
															type="checkbox"
															name={name}
															id={`${name}_${trIdx + 1}`}
															checked={list.includes(trIdx + 1 + "")}
															onChange={() => {
																let sameClick = false; // 같은거 클릭 시
																if (list.includes(trIdx + 1 + "")) sameClick = true;
																if (subContents.checkType == 3) {
																	if (!list.includes(trIdx + 1 + "")) list.push(trIdx + 1 + "");
																	const orderVal = `${trIdx + 1}-${tdIdx + 1}-${orderList.length + 1}`;
																	if (!orderList.some((v) => v.startsWith(`${trIdx + 1}-${tdIdx + 1}-`)))
																		orderList.push(orderVal);
																} else {
																	if (!list.includes(trIdx + 1 + "")) list.push(trIdx + 1 + "");
																	else list.splice(list.indexOf(trIdx + 1 + ""), 1);
																}

																// 전체 갯수 제한이 있을 떄
																if (
																	subContents.checkType == 1 &&
																	subContents?.checkLimit?.all !== undefined &&
																	otherCheckTrueCount() + list.length >
																		(subContents.checkLimit.all || totalCheckInputCount)
																) {
																	dispatch({
																		type: "modal/on_modal_alert",
																		payload: `${subContents.checkLimit.all || 1}개까지 선택 가능합니다.`,
																	});
																}
																// 열마다 갯수 제한이 있을 떄
																else if (
																	subContents.checkType == 2 &&
																	subContents?.checkLimit &&
																	subContents.checkLimit[name] !== undefined &&
																	list.length > (subContents.checkLimit[name] || 1)
																) {
																	dispatch({
																		type: "modal/on_modal_alert",
																		payload: `${subContents.checkLimit[name] || 1}개까지 선택 가능합니다.`,
																	});
																}
																// 순서를 체크할 때
																else if (
																	subContents.checkType == 3 &&
																	subContents?.checkLimit?.maxOrder !== undefined &&
																	(orderList.length > subContents.checkLimit.maxOrder ||
																		(sameClick && orderList.length == subContents.checkLimit.maxOrder))
																) {
																	const obj = otherCheckData().reduce<Record<string, "">>((acc, key) => {
																		acc[key] = "";
																		return acc;
																	}, {});
																	const etcList = Object.keys(resultData).filter(
																		(v) => v.startsWith(`R_${R_num}_`) && v.endsWith("_etc")
																	);
																	if (etcList.length > 0) obj[etcList[0]] = "";
																	changeResultData(undefined, {
																		...obj,
																		[name]: "",
																		[orderName]: "",
																	});
																}
																// 기타(etc) 언체크 시
																else if (
																	resultData[`R_${R_num}_${trIdx + 1}_etc`] !== undefined &&
																	tdArr.filter((v) => v === "R_check").length > 1 &&
																	!list.includes(trIdx + 1 + "") &&
																	Object.keys(resultData)
																		.filter(
																			(v) => v.startsWith(`R_${R_num}_n_`) && v.endsWith("_che") && v !== name
																		)
																		.every((v) => {
																			const data = resultData[v] || "";
																			const dList = data === "" ? [] : String(data).split(",");
																			return !dList.includes(trIdx + 1 + "");
																		})
																) {
																	changeResultData(undefined, {
																		[name]: list.join(","),
																		[`R_${R_num}_${trIdx + 1}_etc`]: "",
																	});
																}
																// 열 체크 한개 + 기타(etc)가 줄에 존재하고 언체크 시에
																else if (
																	resultData[`R_${R_num}_${trIdx + 1}_etc`] !== undefined &&
																	tdArr.filter((v) => v === "R_check").length === 1 &&
																	!list.includes(trIdx + 1 + "")
																) {
																	changeResultData(undefined, {
																		[name]: list.join(","),
																		[`R_${R_num}_${trIdx + 1}_etc`]: "",
																	});
																} else {
																	const obj: Record<string, string> = {};
																	// 해당없음이 있을 때
																	if (noNameIdx != null) {
																		// 해당없음 클릭 시
																		if (noNameIdx == trIdx) {
																			if (list.includes(noNameIdx + 1 + "")) {
																				list = [noNameIdx + 1 + ""];
																				const etc = Object.keys(resultData).filter(
																					(v) => v.startsWith(`R_${R_num}_`) && v.endsWith("_etc")
																				);
																				if (etc.length > 0) obj[etc[0]] = "";
																			} else {
																				list = [];
																			}
																		}
																		// 해당없음이 있는데 다른거 클릭 시
																		else {
																			if (list.includes(noNameIdx + 1 + "")) {
																				list.splice(list.indexOf(noNameIdx + 1 + ""), 1);
																			}
																		}
																	}
																	obj[name] = list.join(",");
																	if (resultData[orderName] != undefined) {
																		obj[orderName] = orderList.join(",");
																	}
																	changeResultData(undefined, obj);
																}
															}}
															disabled={
																isEtcInput &&
																resultData[`R_${R_num}_${trIdx + 1}_etc`] !== undefined &&
																resultData[`R_${R_num}_${trIdx + 1}_etc`] === ""
															}
														/>
														<label htmlFor={`${name}_${trIdx + 1}`}></label>
													</>
												);
											} else if (td === "R_radio") {
												commonAttr.className = "text-center";
												const name = `R_${R_num}_n_${tdIdx + 1}_rad`;
												const data = resultData[name];
												inEles.push(
													<>
														<input
															type="radio"
															id={`${name}_${trIdx + 1}`}
															name={name}
															value={trIdx + 1}
															checked={data == String(trIdx + 1)}
															onChange={(e) => changeResultData(e)}
															disabled={resultData[`R_${R_num}_${trIdx + 1}_etc`] === ""}
														/>
														<label htmlFor={`${name}_${trIdx + 1}`}></label>
													</>
												);
											} else if (td === "R_relCheck") {
												commonAttr.className = "text-center";
												const frontName = `R_${R_num}_n_${tdIdx + 1}_f`;
												const backName = `R_${R_num}_n_${tdIdx + 1}_b`;
												const fData = resultData[frontName] || "";
												const fList = fData === "" ? [] : String(fData).split(",");
												const bData = resultData[backName] || "";
												const bList = bData === "" ? [] : String(bData).split(",");
												const noNameIdx = noHedang(trArr); // 해당 없음 name
												const checkLimit = subContents.relCheckLimit || 1;
												inEles.push(
													<>
														<input
															type="checkbox"
															name={frontName}
															id={`${frontName}_${trIdx + 1}`}
															checked={fList.includes(trIdx + 1 + "")}
															onChange={() => {
																const obj: { [key: string]: string } = {};
																if (tdArr.some((v) => v.startsWith("해당 없음"))) {
																	if (!fList.includes(trIdx + 1 + "")) obj[frontName] = trIdx + 1 + "";
																	else obj[frontName] = "";
																	obj[backName] = "";
																	Object.keys(resultData)
																		.filter((v) => v.startsWith(`R_${R_num}_`) && v.endsWith("_etc"))
																		.map((v) => {
																			obj[v] = "";
																		});
																	changeResultData(undefined, obj);
																} else {
																	if (noNameIdx != null && fList.includes(noNameIdx + 1 + "")) {
																		fList.splice(fList.indexOf(noNameIdx + 1 + ""), 1);
																	}
																	if (!fList.includes(trIdx + 1 + "")) fList.push(trIdx + 1 + "");
																	else fList.splice(fList.indexOf(trIdx + 1 + ""), 1);
																	if (
																		resultData[`R_${R_num}_${trIdx + 1}_etc`] !== undefined &&
																		!fList.includes(trIdx + 1 + "")
																	) {
																		obj[`R_${R_num}_${trIdx + 1}_etc`] = "";
																	}
																	if (!fList.includes(trIdx + 1 + "") && bList.includes(trIdx + 1 + "")) {
																		bList.splice(bList.indexOf(trIdx + 1 + ""), 1);
																		obj[backName] = bList.join(",");
																	}
																	// etc_있으면 텍스트 지움
																	if (resultData[`R_${R_num}_${trIdx + 1}_etc`]) {
																		obj[`R_${R_num}_${trIdx + 1}_etc`] = "";
																	}
																	obj[frontName] = fList.join(",");
																	changeResultData(undefined, obj);
																}
															}}
															disabled={
																resultData[`R_${R_num}_${trIdx + 1}_etc`] !== undefined &&
																resultData[`R_${R_num}_${trIdx + 1}_etc`] === ""
															}
														/>
														<label htmlFor={`${frontName}_${trIdx + 1}`}></label>
													</>,
													<>
														<input
															type="checkbox"
															name={backName}
															id={`${backName}_${trIdx + 1}`}
															className={backName}
															checked={bList.includes(trIdx + 1 + "")}
															onChange={() => {
																if (!bList.includes(trIdx + 1 + "") && bList.length < checkLimit)
																	bList.push(trIdx + 1 + "");
																else if (!bList.includes(trIdx + 1 + "") && bList.length >= checkLimit)
																	dispatch({
																		type: "modal/on_modal_alert",
																		payload: `${checkLimit}개까지만 선택가능합니다.`,
																	});
																else if (bList.includes(trIdx + 1 + ""))
																	bList.splice(bList.indexOf(trIdx + 1 + ""), 1);
																changeResultData(undefined, {
																	[backName]: bList.join(","),
																});
															}}
															disabled={
																tdArr.some((v) => v.startsWith("해당 없음")) ? true : !fList.includes(trIdx + 1 + "")
															}
														/>
														<label htmlFor={`${backName}_${trIdx + 1}`}></label>
													</>
												);
											} else if (td === "R_relWeight") {
												// 체크
												commonAttr.className = "text-center";
												const frontName = `R_${R_num}_n_${tdIdx + 1}_fWei`;
												const fData = resultData[frontName] || "";
												const fList = fData === "" ? [] : String(fData).split(",");
												const backName = `R_${R_num}_${trIdx + 1}_${tdIdx + 1}_bWei`;
												inEles.push(
													<>
														<input
															type="checkbox"
															name={frontName}
															id={`${frontName}_${trIdx + 1}`}
															checked={fList.includes(trIdx + 1 + "")}
															onChange={() => {
																const obj: Record<string, string> = {};
																if (!fList.includes(trIdx + 1 + "")) fList.push(trIdx + 1 + "");
																else fList.splice(fList.indexOf(trIdx + 1 + ""), 1);
																if (
																	resultData[`R_${R_num}_${trIdx + 1}_etc`] !== undefined &&
																	!fList.includes(trIdx + 1 + "")
																) {
																	obj[`R_${R_num}_${trIdx + 1}_etc`] = "";
																}
																if (!fList.includes(trIdx + 1 + "") && resultData[backName] !== "") {
																	obj[backName] = "";
																}
																// etc_있으면 텍스트 지움
																if (resultData[`R_${R_num}_${trIdx + 1}_etc`]) {
																	obj[`R_${R_num}_${trIdx + 1}_etc`] = "";
																}
																obj[frontName] = fList.join(",");
																changeResultData(undefined, obj);
															}}
															disabled={
																resultData[`R_${R_num}_${trIdx + 1}_etc`] !== undefined &&
																resultData[`R_${R_num}_${trIdx + 1}_etc`] === ""
															}
														/>
														<label htmlFor={`${frontName}_${trIdx + 1}`}></label>
													</>
												);
												// 가중치
												const disabled = disabledCalc(trIdx, tdIdx);
												commonAttr.className = "text-center weight-td";
												fiveAsc.map((num) => {
													inEles.push(
														<>
															<input
																id={`${backName}_${num}`}
																type="radio"
																name={backName}
																value={num}
																className="weight-radio"
																checked={resultData[backName] == num + ""}
																onChange={(e) => changeResultData(e)}
																disabled={disabled || !fList.includes(trIdx + 1 + "")}
															/>
															<label htmlFor={`${backName}_${num}`}></label>
														</>
													);
												});
											} else if (td === "R_etc") {
												const name = `R_${R_num}_${trIdx + 1}_etc`;
												const checkNames: string[] = [];
												let radioName = "";
												let relCheck = "";
												let relWeightName = "";
												const disabledList = Object.keys(resultData).filter((v) => {
													if (v.startsWith(`R_${R_num}_`) && v.endsWith("_che")) checkNames.push(v);
													if (v.startsWith(`R_${R_num}_`) && v.endsWith("_rad")) radioName = v;
													if (v.startsWith(`R_${R_num}_`) && v.endsWith("_f")) relCheck = v;
													if (v.startsWith(`R_${R_num}_`) && v.endsWith("_fWei")) relWeightName = v;
													return v !== name && v.startsWith(`R_${R_num}_${trIdx + 1}_`);
												});
												inEles.push(
													<>
														기타(
														<input
															id={name}
															type="text"
															name={name}
															className="form-control"
															maxLength={35}
															value={resultData[name] || ""}
															onChange={(e) => {
																const obj: { [key: string]: string } = {};
																// 해당 tr줄에 disabled조절할 입력이 있을 경우
																if (disabledList.length > 0 && !e.target.value) {
																	disabledList.map((v) => {
																		obj[v] = "";
																	});
																}
																// 체크데이터가 있을 때
																checkNames.map((checkName) => {
																	const data = resultData[checkName];
																	const list = data === "" ? [] : String(data).split(",");
																	if (!e.target.value && list.includes(trIdx + 1 + ""))
																		list.splice(list.indexOf(trIdx + 1 + ""), 1);
																	// else if (e.target.value && !list.includes(trIdx + 1 + "")) list.push(trIdx + 1 + "");
																	obj[checkName] = list.join(",");
																});
																// 라이오데이터가 있을 때
																if (radioName) {
																	const data = resultData[radioName];
																	if (!e.target.value && data == String(trIdx + 1)) {
																		obj[radioName] = "";
																	} else if (e.target.value && data != String(trIdx + 1)) {
																		obj[radioName] = trIdx + 1 + "";
																	}
																}
																// 연관체크 테이블 일 때
																if (relCheck) {
																	const data = resultData[relCheck];
																	const dataList = data ? String(data).split(",") : [];
																	const noNameIdx = noHedang(trArr); // 해당 없음 name
																	if (noNameIdx != null && dataList.includes(noNameIdx + 1 + "")) {
																		dataList.splice(dataList.indexOf(`${noNameIdx + 1}`), 1);
																	}
																	if (e.target.value && !dataList.includes(trIdx + 1 + "")) {
																		dataList.push(String(trIdx + 1));
																		obj[relCheck] = dataList.join(",");
																	} else if (!e.target.value && dataList.includes(trIdx + 1 + "")) {
																		dataList.splice(dataList.indexOf(`${trIdx + 1}`), 1);
																		obj[relCheck] = dataList.join(",");
																	}
																}
																// 연관가중치 테이블 일 때
																if (relWeightName) {
																	const data = resultData[relWeightName];
																	const dataList = data ? String(data).split(",") : [];
																	if (e.target.value && !dataList.includes(trIdx + 1 + "")) {
																		dataList.push(trIdx + 1 + "");
																		obj[relWeightName] = dataList.join(",");
																	} else if (!e.target.value && dataList.includes(trIdx + 1 + "")) {
																		dataList.splice(dataList.indexOf(`${trIdx + 1}`), 1);
																		obj[relWeightName] = dataList.join(",");
																	}
																}
																changeResultData(e, obj);
															}}
														/>
														)
													</>
												);
											} else if (td === "$total") {
												let total = 0;
												const name = `R_${R_num}_n_${tdIdx + 1}`;
												let cur = null;
												for (let i = 1; i <= trIdx; i++) {
													if ((cur = resultData[name.replace("n", i + "")]) !== undefined) {
														total += Number(cur);
													}
												}
												commonAttr.className = "align_center";
												totalExist[name] = trIdx;
												inEles.push(<>{total}%</>);
											} else if (td === "$totalRow") {
												let total = 0;
												const name = `R_${R_num}_${trIdx + 1}_n`;
												let cur = null;
												for (let i = 1; i <= tdIdx; i++) {
													if ((cur = resultData[name.replace("n", i + "")]) !== undefined) {
														total += Number(cur);
													}
												}
												commonAttr.className = "align_center";
												totalExist[name] = tdIdx;
												inEles.push(<>{total}%</>);
											} else {
												inEles.push(<span dangerouslySetInnerHTML={{ __html: td }} />);
											}
											return (
												<React.Fragment key={tdKey}>
													{inEles.map((inEle, inEleIdx) => (
														<td key={tdKey + inEleIdx} {...commonAttr} {...customAttr[trIdx * 5 + inEleIdx]}>
															{inEle}
														</td>
													))}
												</React.Fragment>
											);
										}
									})}
								</tr>
							);
						});
					})()}
				</tbody>
			</table>
		</div>
	);
}
