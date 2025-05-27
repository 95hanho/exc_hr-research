import { useEffect } from "react";
import { AdminSurveyQuestionProps, EtcTextareaQuestion } from "../../types/survey";

interface EtcTextareaProps extends AdminSurveyQuestionProps {
	subContents: EtcTextareaQuestion["subContents"];
}

export default function AdminEtcTextarea({ subContents, R_num, changeSubcontents }: EtcTextareaProps) {
	const executeChange = () => {
		changeSubcontents(R_num, subContents);
	};

	useEffect(() => {
		executeChange();
	}, []);

	return (
		<div className="textarea">
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
		</div>
	);
}
