import { EtcTextSubContents } from "../../types/question";

interface EtcTextProps {
	R_num: number;
	subContents?: EtcTextSubContents;
}

export default function EtcText_view({ subContents, R_num }: EtcTextProps) {
	return (
		<div className="ask_wr etcText">
			<span>
				<input
					type="text"
					id={`R_${R_num}_etc`}
					name={`R_${R_num}_etc`}
					placeholder={subContents?.placeholder}
					className="form-control w80"
					maxLength={35}
				/>
			</span>
			{subContents?.comment && <div>{subContents.comment}</div>}
		</div>
	);
}
