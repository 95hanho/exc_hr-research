import { useEffect, useState } from "react";
import { brToN, nToBr } from "../../lib/ui";

interface MunhangTextareaProps {
	value: string;
	onChange: (val: string) => void;
	className?: string;
	placeholder?: string;
	style?: Record<string, string>;
}

export default function MunhangTextarea({ value, onChange, className = "", placeholder = "", style = {} }: MunhangTextareaProps) {
	const [localTitle, set_localTitle] = useState(brToN(value));

	useEffect(() => {
		set_localTitle(brToN(value));
	}, [value]);

	return (
		<textarea
			className={"munhang-textarea" + (className ? " " + className : "")}
			value={localTitle}
			rows={(localTitle?.match(/\n/g)?.length || 0) + 1}
			placeholder={placeholder}
			style={style}
			onChange={(e) => set_localTitle(e.target.value)}
			onBlur={() => onChange(nToBr(localTitle))}
		/>
	);
}
