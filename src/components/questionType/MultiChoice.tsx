import { useDispatch } from "react-redux";
import { SurveyQuestionProps } from "../../types/survey";
import { MultiChoiceSubContents } from "../../types/question";

interface MultiChoiceProps extends SurveyQuestionProps {
	subContents: MultiChoiceSubContents;
}

interface ChoiceGroupProps extends SurveyQuestionProps {
	subContents: MultiChoiceSubContents;
	choices: MultiChoiceSubContents["choices"];
	allChoices: MultiChoiceSubContents["choices"];
	halfIndex: number;
	multiChoiceData: string;
}

const ChoiceGroup = ({ choices, subContents, resultData, changeResultData, R_num, halfIndex, multiChoiceData, allChoices }: ChoiceGroupProps) => {
	const dispatch = useDispatch();

	return (
		<>
			{choices?.map((choice, choiceIdx) => {
				const choiceNum = halfIndex + choiceIdx + 1;
				const change_choiceIdx = halfIndex + choiceIdx;

				return (
					<div key={"choice" + change_choiceIdx} className={"it" + ` number${choiceNum}`} style={{ marginTop: "6px" }}>
						{/* plural = true 다중선택 */}
						{subContents.plural ? (
							<>
								{choice.content === "R_etc" ? (
									<>
										<label className="etc_lb">
											<input
												type="checkbox"
												name={`R_${R_num}_multi`}
												// value={choiceNum}
												checked={multiChoiceData ? multiChoiceData.split(",").includes(choiceNum + "") : false}
												onChange={(e) => {
													const prev = multiChoiceData || "";
													let list = prev ? prev.split(",") : [];
													const noHedangIdx =
														allChoices?.findIndex((v) => v.content.replace(/\s/g, "").startsWith("해당없음")) || -1;
													if (noHedangIdx != -1 && noHedangIdx == change_choiceIdx) {
														if (list.includes(noHedangIdx + 1 + "")) {
															list = [];
														} else {
															list = [choiceNum + ""];
														}
													} else {
														if (noHedangIdx != -1 && list.includes(noHedangIdx + 1 + "")) {
															list.splice(list.indexOf(noHedangIdx + 1 + ""), 1);
														}
														if (!list.includes(choiceNum + "")) {
															if (subContents.count && list.length + 1 > subContents.count) {
																/* 갯수초과 */
																dispatch({
																	type: "modal/on_modal_alert",
																	payload: `${subContents.count || 1}개까지 선택 가능합니다.`,
																});
																return false;
															}
															list.push(choiceNum + "");
														} else {
															list.splice(list.indexOf(choiceNum + ""), 1);
														}
													}
													changeResultData(undefined, { [e.target.name]: list.join(","), [`R_${R_num}_etc`]: "" });
												}}
											/>
											<span>기타</span>
										</label>
										<span className="etc_f">
											<input
												type="text"
												id={`R_${R_num}_etc`}
												name={`R_${R_num}_etc`}
												className="input_etc form-control"
												maxLength={35}
												value={resultData[`R_${R_num}_etc`] || ""}
												onChange={(e) => changeResultData(e)}
												disabled={multiChoiceData ? !multiChoiceData.split(",").includes(choiceNum + "") : true}
											/>
										</span>
									</>
								) : (
									<label>
										<input
											type="checkbox"
											name={`R_${R_num}_multi`}
											// value={choiceNum}
											checked={multiChoiceData ? multiChoiceData.split(",").includes(choiceNum + "") : false}
											onChange={(e) => {
												const prev = multiChoiceData || "";
												let list = prev ? prev.split(",") : [];
												const noHedangIdx =
													allChoices?.findIndex((v) => v.content.replace(/\s/g, "").startsWith("해당없음")) || -1;
												if (noHedangIdx != -1 && noHedangIdx == change_choiceIdx) {
													if (list.includes(noHedangIdx + 1 + "")) {
														list = [];
													} else {
														list = [choiceNum + ""];
													}
												} else {
													if (noHedangIdx != -1 && list.includes(noHedangIdx + 1 + "")) {
														list.splice(list.indexOf(noHedangIdx + 1 + ""), 1);
													}
													if (!list.includes(choiceNum + "")) {
														if (subContents.count && list.length + 1 > subContents.count) {
															/* 갯수초과 */
															dispatch({
																type: "modal/on_modal_alert",
																payload: `${subContents.count || 1}개까지 선택 가능합니다.`,
															});
															return false;
														}
														list.push(choiceNum + "");
													} else {
														list.splice(list.indexOf(choiceNum + ""), 1);
													}
												}
												const obj = { [e.target.name]: list.join(",") };
												if (noHedangIdx != -1 && noHedangIdx == change_choiceIdx) obj[`R_${R_num}_etc`] = "";
												changeResultData(undefined, obj);
											}}
										/>
										<span dangerouslySetInnerHTML={{ __html: choice.content }} />
									</label>
								)}
							</>
						) : (
							/* plural = false 단일 선택 */ <>
								{choice.content === "R_etc" ? (
									<>
										<label className="etc_lb">
											<input
												type="radio"
												name={`R_${R_num}_multi`}
												value={choiceNum}
												checked={multiChoiceData ? multiChoiceData == String(choiceNum) : false}
												onChange={(e) => {
													changeResultData(e, {
														[`R_${R_num}_etc`]: "",
													});
												}}
											/>
											<span>기타</span>
										</label>
										<span className="etc_f">
											<input
												type="text"
												id={`R_${R_num}_etc`}
												name={`R_${R_num}_etc`}
												className="input_etc form-control"
												maxLength={35}
												value={resultData[`R_${R_num}_etc`] || ""}
												onChange={(e) => changeResultData(e)}
												disabled={multiChoiceData ? multiChoiceData != String(choiceNum) : true}
											/>
										</span>
									</>
								) : (
									<label>
										<input
											type="radio"
											name={`R_${R_num}_multi`}
											value={choiceNum}
											checked={multiChoiceData ? multiChoiceData == String(choiceNum) : false}
											onChange={(e) =>
												changeResultData(e, {
													[`R_${R_num}_etc`]: "",
												})
											}
										/>
										<span dangerouslySetInnerHTML={{ __html: choice.content }} />
									</label>
								)}
							</>
						)}

						{choice.notic && <span className="notic">{choice.notic}</span>}
					</div>
				);
			})}
		</>
	);
};

/*
 * 다중객관식
 */
export default function MultiChoice({ subContents, resultData, changeResultData, R_num }: MultiChoiceProps) {
	const multiChoiceData: string = String(resultData[`R_${R_num}_multi`]) || ""; // null이면 빈 문자열로 대체

	const halfIndex = Math.ceil((subContents.choices?.length || 0) / 2);
	const allChoices = subContents.choices;
	const firstHalf = subContents.choices?.slice(0, halfIndex);
	const secondHalf = subContents.choices?.slice(halfIndex);

	const choiceGroupAttr = {
		subContents,
		resultData,
		changeResultData,
		R_num,
		halfIndex,
		multiChoiceData,
		allChoices,
	};

	return (
		<div className={`multiple${subContents.half ? " half" : ""}`}>
			<div className="choice-group">
				<ChoiceGroup choices={firstHalf} {...choiceGroupAttr} halfIndex={0} />
			</div>
			<div className="choice-group">
				<ChoiceGroup choices={secondHalf} {...choiceGroupAttr} halfIndex={halfIndex} />
			</div>
		</div>
	);
}
