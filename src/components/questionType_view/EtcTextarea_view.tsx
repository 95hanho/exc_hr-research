import { EtcTextareaSubContents } from "../../types/question";

interface EtcTextareaProps {
	R_num: number;
	subContents?: EtcTextareaSubContents;
}

export default function EtcTextarea_view({ subContents, R_num }: EtcTextareaProps) {
	return (
		<div className="textarea">
			<textarea
				id={`R_${R_num}_etc`}
				cols={30}
				rows={10}
				className="form-control"
				placeholder={subContents?.placeholder || ""}
				name={`R_${R_num}_etc`}
			></textarea>
		</div>
	);
}
