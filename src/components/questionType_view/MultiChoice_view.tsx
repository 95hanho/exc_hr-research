import { MultiChoiceQuestion } from "../../types/survey";

interface MultiChoiceProps {
	R_num: number;
	subContents: MultiChoiceQuestion["subContents"];
}

interface ChoiceGroupProps extends MultiChoiceProps {
	choices: MultiChoiceQuestion["subContents"]["choices"];
	halfIndex: number;
}

/*
 * 다중객관식
 */
export default function MultiChoice_view({ subContents, R_num }: MultiChoiceProps) {
	const halfIndex = Math.ceil((subContents.choices?.length || 0) / 2);
	const firstHalf = subContents.choices?.slice(0, halfIndex);
	const secondHalf = subContents.choices?.slice(halfIndex);

	const choiceGroupAttr = {
		subContents,
		R_num,
		halfIndex,
	};

	const ChoiceGroup = ({ choices, subContents, R_num, halfIndex }: ChoiceGroupProps) => {
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
												/>
											</span>
										</>
									) : (
										<label>
											<input
												type="checkbox"
												name={`R_${R_num}_multi`}
												// value={choiceNum}
											/>
											<span dangerouslySetInnerHTML={{ __html: choice.content }} />
										</label>
									)}
								</>
							) : (
								<>
									{choice.content === "R_etc" ? (
										<>
											<label className="etc_lb">
												<input type="radio" name={`R_${R_num}_multi`} value={choiceNum} />
												<span>기타</span>
											</label>
											<span className="etc_f">
												<input
													type="text"
													id={`R_${R_num}_etc`}
													name={`R_${R_num}_etc`}
													className="input_etc form-control"
													maxLength={35}
												/>
											</span>
										</>
									) : (
										<label>
											<input type="radio" name={`R_${R_num}_multi`} value={choiceNum} />
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
