import { EtcTextSubContents } from "../../types/question";
import { SurveyQuestionProps } from "../../types/survey";

interface EtcTextProps extends SurveyQuestionProps {
	subContents?: EtcTextSubContents;
}

export default function EtcText({ subContents, resultData, changeResultData, R_num }: EtcTextProps) {
	return (
		<div className="ask_wr etcText">
			<span>
				<input
					type="text"
					id={`R_${R_num}_etc`}
					name={`R_${R_num}_etc`}
					placeholder={subContents?.placeholder}
					className="form-control w80"
					value={resultData[`R_${R_num}_etc`] || ""}
					onChange={(e) => changeResultData(e)}
					maxLength={35}
				/>
			</span>
			{subContents?.comment && <div>{subContents.comment}</div>}
		</div>
	);
}
