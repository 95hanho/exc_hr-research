import React from "react";
import { copyText } from "../../lib/ui";
import { EtcTextareaSubContents, EtcTextSubContents, MultiChoiceSubContents, MultiTableSubContents, Munhang } from "../../types/question";
import { ResultData } from "../../types/survey";
import AdminMultiTable from "../adminQuestionType/AdminMultiTable";
import AdminMultiChoice from "../adminQuestionType/AdminMultiChoice";
import AdminEtcText from "../adminQuestionType/AdminEtcText";
import AdminEtcTextarea from "../adminQuestionType/AdminEtcTextarea";
import MultiTable_view from "../questionType_view/MultiTable_view";
import MultiChoice_view from "../questionType_view/MultiChoice_view";
import EtcText_view from "../questionType_view/EtcText_view";
import EtcTextarea_view from "../questionType_view/EtcTextarea_view";
import { useAppDispatch } from "../../hooks/useRedux";
import { MunhangsAction } from "./munhangsReducer";
import MunhangTextarea from "./MunhangTextarea";

interface MunhangEditorProps {
	munhangs: Munhang[];
	munhangsDispatch: React.Dispatch<MunhangsAction>;
	initData: ResultData;
	change_initData: () => ResultData;
}

export default function MunhangEditor({ munhangs, munhangsDispatch, initData, change_initData }: MunhangEditorProps) {
	const dispatch = useAppDispatch();
	return (
		<>
			<div className="page_body">
				{munhangs.length > 0 &&
					munhangs.map((munhang, mIdx) => {
						return (
							<React.Fragment key={"munhang" + mIdx}>
								<section className={`flex munhang`}>
									<div className="tit-col">
										<h3>
											{mIdx + 1}.{" "}
											<MunhangTextarea
												className="smooth-textarea"
												value={munhang.title}
												onChange={(value) => {
													munhangsDispatch({ type: "update_munhang_title", munhangIdx: mIdx, value });
												}}
											/>
											{mIdx > 0 && (
												<button
													className="munhang-delete btn btn-lg btn-danger"
													onClick={() => munhangsDispatch({ type: "delete_munhang", munhangIdx: mIdx })}
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
													onClick={() => munhangsDispatch({ type: "update_mainTitle", munhangIdx: mIdx, value: "" })}
												>
													메인질문+
												</button>
											) : (
												<div className="ask_t1">
													<MunhangTextarea
														className="admin-textarea"
														placeholder="메인 질문을 입력해주세요.(생략가능)"
														value={munhang.mainTitle}
														onChange={(value) => munhangsDispatch({ type: "update_mainTitle", munhangIdx: mIdx, value })}
													/>
													<button
														className="admin-plma"
														onClick={() =>
															munhangsDispatch({ type: "update_mainTitle", munhangIdx: mIdx, value: undefined })
														}
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
													onClick={() =>
														munhangsDispatch({
															type: "update_mainAlert",
															munhangIdx: mIdx,
															payload: {
																color: "danger",
																content: "",
															},
														})
													}
												>
													메인알림+
												</button>
											) : (
												<div
													className={"alert bg-" + munhang.mainAlert.color}
													// dangerouslySetInnerHTML={{ __html: munhang.mainAlert.content }}
												>
													<MunhangTextarea
														className="admin-textarea"
														placeholder="메인알림을 입력해주세요."
														value={munhang.mainAlert.content || ""}
														onChange={(value) =>
															munhangsDispatch({
																type: "update_mainAlert",
																munhangIdx: mIdx,
																payload: { content: value },
															})
														}
													/>
													색변경:
													<input
														type="checkbox"
														checked={munhang.mainAlert.color === "info"}
														onChange={() => {
															if (!munhang.mainAlert) return;
															let color = "";
															if (munhang.mainAlert.color === "info") color = "danger";
															else color = "info";
															munhangsDispatch({ type: "update_mainAlert", munhangIdx: mIdx, payload: { color } });
														}}
													/>
													<button
														className="admin-plma"
														onClick={() =>
															munhangsDispatch({ type: "update_mainAlert", munhangIdx: mIdx, payload: undefined })
														}
													>
														-
													</button>
												</div>
											)}
										</div>
										{/* questions 시작 ----------------------------------------------------------------- */}
										{munhang.questions &&
											(() => {
												return munhang.questions.map((question, qIdx) => {
													const commonProps = {
														initData,
														R_num: question.R_num,
														munhangsDispatch,
													};
													const idxs = {
														munhangIdx: mIdx,
														questionIdx: qIdx,
													};
													return (
														<div
															key={"question" + qIdx}
															id={`R_${question.R_num}`}
															className={`question`}
															style={{
																position: "relative",
																borderBottom: "3px double",
																borderTop: qIdx === 0 ? "3px double" : "",
															}}
														>
															<h2>{question.R_num}번 질문)</h2>
															<div>
																<button
																	className={`admin-plma${question.subPadding ? " red" : ""}`}
																	onClick={() => {
																		munhangsDispatch({
																			type: "update_q_field",
																			...idxs,
																			payload: { subPadding: !question.subPadding },
																		});
																	}}
																>
																	왼쪽 공백
																	{question.subPadding ? "-" : "+"}
																</button>
															</div>
															<div className={`${question.subPadding ? "ask_wr" : "mt"}`}>
																<div className="ask_t1">
																	<MunhangTextarea
																		className="admin-textarea"
																		placeholder="질문 제목을 입력해주세요."
																		value={question.title}
																		onChange={(value) => {
																			munhangsDispatch({
																				type: "update_q_field",
																				...idxs,
																				payload: { title: value },
																			});
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
																			munhangsDispatch({
																				type: "update_q_qType",
																				...idxs,
																				value: e.target.value,
																			});
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
																{question.qType === "MultiTable" && (
																	<AdminMultiTable
																		{...commonProps}
																		subContents={question.subContents as MultiTableSubContents}
																		change_initData={change_initData}
																	/>
																)}
																{question.qType === "MultiChoice" && (
																	<AdminMultiChoice
																		{...commonProps}
																		subContents={question.subContents as MultiChoiceSubContents}
																	/>
																)}
																{question.qType === "EtcText" && (
																	<AdminEtcText
																		{...commonProps}
																		subContents={question.subContents as EtcTextSubContents}
																	/>
																)}
																{question.qType === "EtcTextarea" && (
																	<AdminEtcTextarea
																		{...commonProps}
																		subContents={question.subContents as EtcTextareaSubContents}
																	/>
																)}
																<h3>- 결과</h3>
																{question.qType === "MultiTable" && (
																	<MultiTable_view
																		R_num={question.R_num}
																		subContents={question.subContents as MultiTableSubContents}
																	/>
																)}
																{question.qType === "MultiChoice" && (
																	<MultiChoice_view
																		R_num={question.R_num}
																		subContents={question.subContents as MultiChoiceSubContents}
																	/>
																)}
																{question.qType === "EtcText" && (
																	<EtcText_view
																		R_num={question.R_num}
																		subContents={question.subContents as EtcTextSubContents}
																	/>
																)}
																{question.qType === "EtcTextarea" && (
																	<EtcTextarea_view
																		R_num={question.R_num}
																		subContents={question.subContents as EtcTextareaSubContents}
																	/>
																)}
															</div>
															{question.alert ? (
																<div
																	className={"alert bg-" + question.alert.color}
																	// dangerouslySetInnerHTML={{ __html: question.alert.content }}
																>
																	<MunhangTextarea
																		className="admin-textarea"
																		placeholder="질문알림을 입력해주세요."
																		value={question.alert.content}
																		onChange={(value) =>
																			munhangsDispatch({
																				type: "update_q_field",
																				...idxs,
																				payload: { alert: { content: value } },
																			})
																		}
																	/>
																	색변경:
																	<input
																		type="checkbox"
																		checked={question.alert.color === "info"}
																		onChange={() => {
																			if (!question.alert) return;
																			let color = "";
																			if (question.alert.color === "info") color = "danger";
																			else color = "info";
																			munhangsDispatch({
																				type: "update_q_field",
																				...idxs,
																				payload: { alert: { color } },
																			});
																		}}
																	/>
																	<button
																		className="admin-plma"
																		onClick={() => {
																			munhangsDispatch({
																				type: "update_q_field",
																				...idxs,
																				payload: { alert: undefined },
																			});
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
																			munhangsDispatch({
																				type: "update_q_field",
																				...idxs,
																				payload: {
																					alert: {
																						color: "danger",
																						content: "",
																					},
																				},
																			});
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
																{question.title || Object.keys(question.subContents).length > 0 ? (
																	<button
																		type="button"
																		className="btn btn-lg btn-default"
																		style={{
																			padding: "5px 8px",
																			marginBottom: "5px",
																		}}
																		onClick={() => {
																			copyText(JSON.stringify(question));
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
																					(question.title || Object.keys(question.subContents).length > 0)
																				) {
																					munhangsDispatch({
																						type: "update_q_field",
																						...idxs,
																						payload: question,
																					});
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
																		munhangsDispatch({
																			type: "delete_q",
																			...idxs,
																		});
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
																		munhangsDispatch({
																			type: "insert_q",
																			...idxs,
																		});
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
																		munhangsDispatch({
																			type: "insert_q",
																			...idxs,
																			questionIdx: qIdx + 1,
																		});
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
						munhangsDispatch({
							type: "insert_munhang",
						});
					}}
				>
					문항 +
				</button>
			</div>
		</>
	);
}
