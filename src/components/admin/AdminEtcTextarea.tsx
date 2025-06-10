import { useCallback, useEffect } from "react";
import { AdminSurveyQuestionProps } from "../../types/survey";
import { EtcTextareaSubContents } from "../../types/question";

interface EtcTextareaProps extends AdminSurveyQuestionProps {
	subContents: EtcTextareaSubContents;
}

export default function AdminEtcTextarea({ subContents, R_num, changeSubcontents }: EtcTextareaProps) {
	const executeChange = useCallback(() => {
		changeSubcontents({ R_num, subContents, qType: "EtcTextarea" });
	}, [changeSubcontents, R_num, subContents]);

	useEffect(() => {
		executeChange();
	}, [executeChange]);

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
