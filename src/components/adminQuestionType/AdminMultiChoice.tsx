import { useState } from "react";
import ModalJimoon from "../modal/ModalJimoon";
import { AdminSurveyQuestionProps } from "../../types/survey";
import { MultiChoiceSubContents } from "../../types/question";
import MunhangText from "../admin/MunhangText";
import MunhangTextarea from "../admin/MunhangTextarea";

interface MultiChoiceProps extends AdminSurveyQuestionProps {
	subContents: MultiChoiceSubContents;
}

/*
 * 다중객관식
 */
export default function AdminMultiChoice({ subContents, R_num, munhangsDispatch }: MultiChoiceProps) {
	const t_changeSubcontents = (in_subContents: Partial<MultiChoiceSubContents>, keepPrev: boolean = true) => {
		// keepPrev : 이전 내용을 유지할지
		const merged = keepPrev ? { ...subContents, ...in_subContents } : in_subContents;
		munhangsDispatch({
			type: "change_q_subcontents",
			R_num,
			subContents: merged,
		});
	};

	const [modalOn, set_modalOn] = useState(false);
	// 엑셀 지문넣기
	const input_jimoon = (excelData: string[][]) => {
		const list: MultiChoiceSubContents["choices"] = [];
		excelData.map((v) => {
			list.push({
				content: v[0] === "기타" ? "R_etc" : v[0],
				notic: "",
			});
		});
		t_changeSubcontents(
			{
				choices: list,
			},
			false
		);
	};

	return (
		<div className={`multiple`}>
			<div>
				<div style={{ display: "flex", alignItems: "center" }}>
					복수선택 :{" "}
					<input
						type="checkbox"
						checked={subContents.plural || false}
						onChange={() => t_changeSubcontents({ plural: !subContents.plural })}
					/>
					{subContents?.plural && (
						<>
							선택 갯수:{" "}
							<MunhangText
								className="form-control"
								placeholder="제한 없음"
								value={String(subContents.count) || ""}
								onChange={(value) => {
									let targetVal: number | undefined = Number(value.replace(/\D/g, ""));
									if (targetVal <= 0) targetVal = undefined;
									else {
										if (subContents.choices && subContents.choices.length < targetVal) {
											targetVal = subContents.choices.length;
										}
									}
									t_changeSubcontents({
										count: targetVal,
									});
								}}
							/>
							갯수 필수체크여부
							<input
								id={"requiredCount" + R_num}
								type="checkbox"
								checked={subContents.requiredCount || false}
								onChange={() =>
									t_changeSubcontents({
										requiredCount: !subContents.requiredCount,
									})
								}
							/>
						</>
					)}
					<button
						tabIndex={-1}
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
						t_changeSubcontents({
							half: e.target.value === "on",
						});
					}}
				>
					<option value="off">일렬로</option>
					<option value="on">두줄로</option>
				</select>
			</div>
			<div className={`admin-choice`}>
				{subContents.choices.map((choice, choiceIdx, choiceArr) => {
					return (
						<div key={"choice" + choiceIdx} className="it" style={{ marginTop: "6px" }}>
							<select
								value={choice.content === "R_etc" ? choice.content : ""}
								onChange={(e) => {
									t_changeSubcontents({
										choices: subContents.choices.map((v, i) =>
											i === choiceIdx ? { ...subContents.choices[choiceIdx], content: e.target.value } : v
										),
									});
								}}
							>
								<option value="">텍스트</option>
								{(choice.content === "R_etc" || choiceArr.every((v) => v.content !== "R_etc")) && <option value="R_etc">기타</option>}
							</select>
							<label style={{ width: "50%" }}>
								{choiceIdx + 1} :{" "}
								{choice.content !== "R_etc" ? (
									<MunhangTextarea
										className="admin-textarea"
										style={{ width: "80%" }}
										value={choice.content}
										placeholder="선택지를 입력해주세요."
										onChange={(value) => {
											t_changeSubcontents({
												choices: subContents.choices.map((v, i) =>
													i === choiceIdx ? { ...subContents.choices[choiceIdx], content: value } : v
												),
											});
										}}
									/>
								) : (
									"기타"
								)}
							</label>
							<MunhangText
								placeholder="부가설명을 입력해주세요."
								style={{ fontSize: "12px", backgroundColor: "#fff" }}
								value={choice.notic || ""}
								onChange={(value) => {
									t_changeSubcontents({
										choices: subContents.choices.map((v, i) =>
											i === choiceIdx ? { ...subContents.choices[choiceIdx], notic: value } : v
										),
									});
								}}
							/>
							{choiceArr.length > 2 && (
								<button
									tabIndex={-1}
									className="admin-plma red"
									onClick={() => {
										t_changeSubcontents({
											choices: subContents.choices.filter((_, i) => i !== choiceIdx),
										});
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
					tabIndex={-1}
					className="admin-plma"
					onClick={() => {
						t_changeSubcontents({
							choices: [
								...subContents.choices,
								{
									content: "",
									notic: null,
								},
							],
						});
					}}
				>
					선택지추가 +
				</button>
			</div>
		</div>
	);
}
