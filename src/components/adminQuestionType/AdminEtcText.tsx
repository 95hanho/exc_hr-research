import { AdminSurveyQuestionProps } from "../../types/survey";
import { EtcTextSubContents } from "../../types/question";
import MunhangText from "../admin/MunhangText";

interface EtcTextProps extends AdminSurveyQuestionProps {
	subContents: EtcTextSubContents;
}

export default function AdminEtcText({ subContents, R_num, munhangsDispatch }: EtcTextProps) {
	const t_changeSubcontents = (in_subContents: Partial<EtcTextSubContents>) => {
		munhangsDispatch({
			type: "change_q_subcontents",
			R_num,
			subContents: { ...subContents, ...in_subContents },
		});
	};

	return (
		<>
			<div style={{ display: "flex", alignItems: "center" }}>
				필수입력여부 :{" "}
				<input
					type="checkbox"
					className="form-control"
					checked={subContents.requiredTxt || false}
					onChange={() =>
						t_changeSubcontents({
							requiredTxt: !subContents.requiredTxt,
						})
					}
				/>
			</div>
			<div>
				텍스트 내부 말 :{" "}
				<MunhangText
					value={subContents.placeholder || ""}
					onChange={(value) =>
						t_changeSubcontents({
							placeholder: value,
						})
					}
				/>
			</div>
			<div>
				코멘트 :{" "}
				<MunhangText
					value={subContents.comment || ""}
					onChange={(value) =>
						t_changeSubcontents({
							comment: value,
						})
					}
				/>
			</div>
		</>
	);
}
