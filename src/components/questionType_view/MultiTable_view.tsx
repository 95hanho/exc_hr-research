import React from "react";
import { MultiTableQuestion, MultiTableThCell } from "../../types/survey";

interface MultiTableProps {
	R_num: number;
	subContents: MultiTableQuestion["subContents"];
}

/*
 * 여러용도테이블
 */
export default function MultiTable_view({ subContents, R_num }: MultiTableProps) {
	const fiveAsc = Array.from(Array(5).keys(), (i) => i + 1);
	const totalExist: Record<string, number> = {};

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
										return (
											<th {...attr} {...style}>
												기타
												<input
													type="text"
													name={`R_${R_num}_th_${thIdx + 1}_etc`}
													className="form-control"
													maxLength={35}
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
													const value = valueUp + idIdx + 1;
													inEles.push(
														<>
															<input
																id={`${name}_${value}`}
																type="radio"
																name={name}
																value={value}
																className="weight-radio"
															/>
															<label htmlFor={`${name}_${idIdx + 1}`}></label>
														</>
													);
												}
												fiveAsc.map((_, idx) => {
													const cIdx = idx + valueUp + 1;
													const value = idIdx + cIdx + 1;
													inEles.push(
														<>
															<input
																id={`${name}_${value}`}
																type="radio"
																name={name}
																value={value}
																className="weight-radio"
															/>
															<label htmlFor={`${name}_${value}`}></label>
														</>
													);
												});
											} else if (td === "R_per") {
												const name = `R_${R_num}_${trIdx + 1}_${tdIdx + 1}`;
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
															className={`form-control${per_class ? " " + per_class : ""}`}
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
														<input type="text" id={name} name={name} className="form-control" /> {lastText()}
													</>
												);
											} else if (td === "R_year") {
												const name = `R_${R_num}_${trIdx + 1}_${tdIdx + 1}`;
												commonAttr.className = "text-right";
												inEles.push(
													<>
														<input type="text" id={name + "_y"} name={name} className="form-control" maxLength={5} /> 년
														<input type="text" id={name + "_m"} name={name} className="form-control" maxLength={5} /> 개월
													</>
												);
											} else if (td === "R_check") {
												commonAttr.className = "text-center";
												const name = `R_${R_num}_n_${tdIdx + 1}_che`;
												inEles.push(
													<>
														{subContents.checkType == 3 &&
															(() => {
																return (
																	<span
																		style={{
																			fontSize: "25px",
																			marginRight: "3px",
																			verticalAlign: "top",
																		}}
																	>
																		0
																	</span>
																);
															})()}
														<input type="checkbox" name={name} id={`${name}_${trIdx + 1}`} />
														<label htmlFor={`${name}_${trIdx + 1}`}></label>
													</>
												);
											} else if (td === "R_radio") {
												commonAttr.className = "text-center";
												const name = `R_${R_num}_n_${tdIdx + 1}_rad`;
												inEles.push(
													<>
														<input type="radio" id={`${name}_${trIdx + 1}`} name={name} value={trIdx + 1} />
														<label htmlFor={`${name}_${trIdx + 1}`}></label>
													</>
												);
											} else if (td === "R_relCheck") {
												commonAttr.className = "text-center";
												const frontName = `R_${R_num}_n_${tdIdx + 1}_f`;
												const backName = `R_${R_num}_n_${tdIdx + 1}_b`;
												inEles.push(
													<>
														<input type="checkbox" name={frontName} id={`${frontName}_${trIdx + 1}`} />
														<label htmlFor={`${frontName}_${trIdx + 1}`}></label>
													</>,
													<>
														<input type="checkbox" name={backName} id={`${backName}_${trIdx + 1}`} className={backName} />
														<label htmlFor={`${backName}_${trIdx + 1}`}></label>
													</>
												);
											} else if (td === "R_relWeight") {
												// 체크
												commonAttr.className = "text-center";
												const frontName = `R_${R_num}_n_${tdIdx + 1}_fWei`;
												const backName = `R_${R_num}_${trIdx + 1}_${tdIdx + 1}_bWei`;
												inEles.push(
													<>
														<input type="checkbox" name={frontName} id={`${frontName}_${trIdx + 1}`} />
														<label htmlFor={`${frontName}_${trIdx + 1}`}></label>
													</>
												);
												// 가중치
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
															/>
															<label htmlFor={`${backName}_${num}`}></label>
														</>
													);
												});
											} else if (td === "R_etc") {
												const name = `R_${R_num}_${trIdx + 1}_etc`;
												inEles.push(
													<>
														기타(
														<input id={name} type="text" name={name} className="form-control" maxLength={35} />)
													</>
												);
											} else if (td === "$total") {
												const total = 0;
												const name = `R_${R_num}_n_${tdIdx + 1}`;
												commonAttr.className = "align_center";
												totalExist[name] = trIdx;
												inEles.push(<>{total}%</>);
											} else if (td === "$totalRow") {
												const total = 0;
												const name = `R_${R_num}_${trIdx + 1}_n`;
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
