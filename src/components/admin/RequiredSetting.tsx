import React, { useState } from "react";
import { RequiredHideRule, ResultData } from "../../types/survey";
import { RequiredListAction } from "./requiredListReducer";

interface RequiredSettingProps {
	requiredList: RequiredHideRule[];
	reqListDispatch: React.Dispatch<RequiredListAction>;
	initData: ResultData;
	change_initData: () => ResultData;
}

export default function RequiredSetting({ requiredList, reqListDispatch, initData, change_initData }: RequiredSettingProps) {
	const [requiredOn, set_requiredOn] = useState<boolean>(false);

	return (
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
							{requiredList.map((required, rIdx) => {
								return (
									<div
										key={"required" + rIdx}
										style={{
											backgroundColor: "rgba(242, 203, 97, 0.2)",
											borderBottom: "2px solid #aaa",
										}}
									>
										<button className="btn btn-danger" onClick={() => reqListDispatch({ type: "remove_required", index: rIdx })}>
											삭제
										</button>
										어떤 속성이 :{" "}
										<select
											className="form-control"
											value={required.attr}
											onChange={(e) => {
												const value = e.target.value;
												if (!value) reqListDispatch({ type: "reset_required", index: rIdx });
												reqListDispatch({ type: "update_attr", index: rIdx, value });
											}}
										>
											<option value=""></option>
											{Object.keys(initData).map((v, i) => (
												<option key={"rNum" + i} value={v}>
													{v}
												</option>
											))}
										</select>
										{required.attr && (
											<>
												어떤 값이면 :
												{required.values.map((v, i, arr) => (
													<React.Fragment key={"requiredVal" + i}>
														<input
															type="text"
															className="form-control"
															value={v}
															onChange={(e) =>
																reqListDispatch({
																	type: "update_value",
																	index: rIdx,
																	valueIndex: i,
																	value: e.target.value,
																})
															}
														/>
														{arr.length > 1 && (
															<button
																className="btn btn-default"
																onClick={() => reqListDispatch({ type: "remove_value", index: rIdx, valueIndex: i })}
															>
																-
															</button>
														)}
													</React.Fragment>
												))}
												<button
													className="btn btn-danger"
													onClick={() => reqListDispatch({ type: "add_value", index: rIdx })}
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
																onChange={(e) =>
																	reqListDispatch({
																		type: "update_hide",
																		index: rIdx,
																		hideIndex: i,
																		value: e.target.value,
																	})
																}
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
																	onClick={() =>
																		reqListDispatch({ type: "remove_hide", index: rIdx, hideIndex: i })
																	}
																>
																	-
																</button>
															)}
														</React.Fragment>
													);
												})}
												<button className="btn btn-danger" onClick={() => reqListDispatch({ type: "add_hide", index: rIdx })}>
													+
												</button>
											</>
										)}
									</div>
								);
							})}
						</div>
						<div>
							<button className="btn btn-primary" onClick={() => reqListDispatch({ type: "add_required" })}>
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
	);
}
