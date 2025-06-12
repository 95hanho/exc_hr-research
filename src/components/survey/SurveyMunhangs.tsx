import { EtcTextareaSubContents, EtcTextSubContents, MultiChoiceSubContents, MultiTableSubContents, Munhang } from "../../types/question";
import { ResultData, SurveyQuestionProps } from "../../types/survey";
import EtcText from "../questionType/EtcText";
import EtcTextarea from "../questionType/EtcTextarea";
import MultiChoice from "../questionType/MultiChoice";
import MultiTable from "../questionType/MultiTable";

interface SurveyMunhangsProps {
	munhangs: Munhang[];
	resultData: ResultData;
	changeResultData: (e?: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, addObj?: ResultData) => void;
	testView: boolean;
}

export default function SurveyMunhangs({ munhangs, resultData, changeResultData, testView }: SurveyMunhangsProps) {
	return (
		<div className="page_body">
			{munhangs.length > 0 &&
				(() => {
					return munhangs.map((munhang, mIdx) => {
						return (
							<section key={"munhang" + mIdx} className={`flex munhang${munhang.mainHide ? " hide" : ""}`}>
								<div className="tit-col">
									<h3
										dangerouslySetInnerHTML={{
											__html: `${mIdx + 1}. ${munhang.title}`,
										}}
									/>
								</div>
								<div className="desc-col">
									{munhang.mainTitle && <div className="ask_t1" dangerouslySetInnerHTML={{ __html: munhang.mainTitle }}></div>}
									{munhang.mainAlert && (
										<div
											className={"alert bg-" + munhang.mainAlert.color}
											dangerouslySetInnerHTML={{ __html: String(munhang.mainAlert.content) }}
										></div>
									)}
									{munhang.questions.map((question, qIdx) => {
										const R_num = question.R_num as number;
										const commonProps: SurveyQuestionProps = {
											resultData,
											changeResultData,
											R_num,
										};
										return (
											<div
												key={"question" + qIdx}
												id={`R_${R_num}`}
												className={`question${question.hide || munhang.mainHide ? " hide" : ""}`}
											>
												{testView && <h1>question {R_num} 번</h1>}
												<div className={`${question.subPadding ? "ask_wr" : "mt"}`}>
													<div
														className="ask_t1"
														dangerouslySetInnerHTML={{
															__html: question.title,
														}}
													></div>
													{question.qType === "MultiTable" && (
														<MultiTable {...commonProps} subContents={question.subContents as MultiTableSubContents} />
													)}
													{question.qType === "MultiChoice" && (
														<MultiChoice {...commonProps} subContents={question.subContents as MultiChoiceSubContents} />
													)}
													{question.qType === "EtcText" && (
														<EtcText {...commonProps} subContents={question.subContents as EtcTextSubContents} />
													)}
													{question.qType === "EtcTextarea" && (
														<EtcTextarea {...commonProps} subContents={question.subContents as EtcTextareaSubContents} />
													)}
												</div>
												{question.alert && (
													<div
														className={`alert bg-${question.alert.color}`}
														dangerouslySetInnerHTML={{
															__html: question.alert.content,
														}}
													/>
												)}
											</div>
										);
									})}
								</div>
							</section>
						);
					});
				})()}
		</div>
	);
}
