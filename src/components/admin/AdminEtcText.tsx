import { useEffect } from "react";
import { AdminSurveyQuestionProps, EtcTextQuestion } from "../../types/survey";

interface EtcTextProps extends AdminSurveyQuestionProps {
	subContents: EtcTextQuestion["subContents"];
}

export default function AdminEtcText({ subContents, R_num, changeSubcontents }: EtcTextProps) {
	const executeChange = () => {
		changeSubcontents(R_num, subContents);
	};

	useEffect(() => {
		executeChange();
	}, []);

	return (
		<>
			<div style={{ display: "flex", alignItems: "center" }}>
				필수입력여부 :{" "}
				<input
					type="checkbox"
					className="form-control"
					checked={subContents.requiredTxt || false}
					onChange={() => {
						subContents.requiredTxt = !subContents.requiredTxt;
						executeChange();
					}}
				/>
			</div>
			<div>
				텍스트 내부 말 :{" "}
				<input
					type="text"
					value={subContents.placeholder || ""}
					onChange={(e) => {
						subContents.placeholder = e.target.value;
						executeChange();
					}}
				/>
			</div>
			<div>
				코멘트 :{" "}
				<input
					type="text"
					value={subContents.comment || ""}
					onChange={(e) => {
						subContents.comment = e.target.value;
						executeChange();
					}}
				/>
			</div>
		</>
	);
}
