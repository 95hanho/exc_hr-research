import { EtcTextareaQuestion, SurveyQuestionProps } from "../../types/survey";

interface EtcTextareaProps extends SurveyQuestionProps {
	subContents?: EtcTextareaQuestion["subContents"];
}

export default function EtcTextarea({ subContents, resultData, changeResultData, R_num }: EtcTextareaProps) {
	return (
		<div className="textarea">
			<textarea
				id={`R_${R_num}_etc`}
				cols={30}
				rows={10}
				className="form-control"
				placeholder={subContents?.placeholder || ""}
				name={`R_${R_num}_etc`}
				value={resultData[`R_${R_num}_etc`] || ""}
				onChange={(e) => changeResultData(e)}
			></textarea>
		</div>
	);
}
