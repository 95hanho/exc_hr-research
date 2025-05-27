import { useEffect, useState } from "react";
import ModalJimoon from "../modal/ModalJimoon";
import { AdminSurveyQuestionProps, MultiChoiceQuestion } from "../../types/survey";

interface MultiChoiceProps extends AdminSurveyQuestionProps {
	subContents: MultiChoiceQuestion["subContents"];
}
/*
 * 다중객관식
 */
export default function AdminMultiChoice({ subContents, R_num, changeSubcontents }: MultiChoiceProps) {
	const executeChange = () => {
		changeSubcontents(R_num, subContents);
	};

	useEffect(() => {
		if (!subContents.choices) {
			subContents.plural = false;
			subContents.choices = [
				{ content: "찬성", notic: "" },
				{ content: "반대", notic: "" },
			];
			executeChange();
		}
	}, []);

	const [modalOn, set_modalOn] = useState(false);
	// 엑셀 지문넣기
	const input_jimoon = (excelData: string[][]) => {
		subContents.choices = [];
		excelData.map((v) => {
			subContents.choices?.push({
				content: v[0] === "기타" ? "R_etc" : v[0],
				notic: "",
			});
		});
		executeChange();
	};

	return (
		<div className={`multiple`}>
			<div>
				<div style={{ display: "flex", alignItems: "center" }}>
					복수선택 :{" "}
					<input
						type="checkbox"
						checked={subContents.plural || false}
						onChange={() => {
							subContents.plural = !subContents.plural;
							executeChange();
						}}
					/>
					{subContents?.plural && (
						<>
							선택 갯수:{" "}
							<input
								tabIndex={0}
								type="text"
								className="form-control"
								placeholder="제한 없음"
								value={subContents.count || ""}
								onChange={(e) => {
									let targetVal: number | undefined = Number(e.target.value.replace(/\D/g, ""));
									if (targetVal <= 0) {
										targetVal = undefined;
									} else {
										if (subContents.choices && subContents.choices.length < targetVal) {
											targetVal = subContents.choices.length;
										}
									}
									subContents.count = targetVal;
									executeChange();
								}}
							/>
							갯수 필수체크여부
							<input
								id={"requiredCount" + R_num}
								type="checkbox"
								checked={subContents.requiredCount || false}
								onChange={() => {
									subContents.requiredCount = !subContents.requiredCount;
									executeChange();
								}}
							/>
						</>
					)}
					<button
						style={{ position: "absolute", right: 0 }}
						className="admin-plma green"
						onClick={() => {
							set_modalOn(true);
						}}
					>
						지문엑셀로 넣기
					</button>
					<ModalJimoon modalOn={modalOn} set_modalOn={set_modalOn} input_jimoon={input_jimoon} />
				</div>
			</div>
			<div>
				반 나누기 :{" "}
				<select
					name=""
					id=""
					className="form-control"
					value={subContents?.half ? "on" : "off"}
					onChange={(e) => {
						if (e.target.value === "on") {
							subContents.half = true;
						} else {
							subContents.half = false;
						}
						executeChange();
					}}
				>
					<option value="off">일렬로</option>
					<option value="on">두줄로</option>
				</select>
			</div>
			<div className={`admin-choice`}>
				{subContents?.choices?.map((choice, choiceIdx, choiceArr) => {
					return (
						<div key={"choice" + choiceIdx} className="it" style={{ marginTop: "6px" }}>
							<select
								tabIndex={-1}
								name=""
								id=""
								value={choice.content === "R_etc" ? choice.content : ""}
								onChange={(e) => {
									choice.content = e.target.value;
									executeChange();
								}}
							>
								<option value="">텍스트</option>
								{(choice.content === "R_etc" || choiceArr.every((v) => v.content !== "R_etc")) && <option value="R_etc">기타</option>}
							</select>
							<label style={{ width: "50%" }}>
								{choiceIdx + 1} :{" "}
								{choice.content !== "R_etc" ? (
									<textarea
										tabIndex={0}
										rows={choice.content?.match(/<br>/g) ? (choice.content.match(/<br>/g)?.length || 0) + 1 : 1}
										className="admin-textarea"
										style={{ width: "80%" }}
										value={choice.content ? choice.content.replace(/<br>/g, "\n") : ""}
										placeholder="선택지를 입력해주세요."
										onChange={(e) => {
											choice.content = e.target.value.replace(/\n/g, "<br>");
											executeChange();
										}}
									/>
								) : (
									"기타"
								)}
							</label>
							<input
								tabIndex={0}
								type="text"
								placeholder="부가설명을 입력해주세요."
								style={{ fontSize: "12px", backgroundColor: "#fff" }}
								value={choice.notic || ""}
								onChange={(e) => {
									choice.notic = e.target.value;
									executeChange();
								}}
							/>
							{choiceArr.length > 2 && (
								<button
									tabIndex={-1}
									className="admin-plma red"
									onClick={() => {
										const list = subContents.choices;
										list?.splice(choiceIdx, 1);
										executeChange();
									}}
								>
									-
								</button>
							)}
						</div>
					);
				})}
			</div>

			<div>
				<button
					className="admin-plma"
					onClick={() => {
						subContents.choices?.push({
							content: "",
							notic: null,
						});
						executeChange();
					}}
				>
					선택지추가 +
				</button>
			</div>
		</div>
	);
}
