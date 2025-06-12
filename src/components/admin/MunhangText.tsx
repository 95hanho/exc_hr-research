import { useEffect, useState } from "react";

interface MunhangTextProps {
	value: string;
	onChange: (val: string) => void;
	className?: string;
	placeholder?: string;
	style?: Record<string, string>;
}

export default function MunhangText({ value, onChange, className = "", placeholder = "", style = {} }: MunhangTextProps) {
	const [localTitle, set_localTitle] = useState(value);

	useEffect(() => {
		set_localTitle(value);
	}, [value]);

	return (
		<input
			type="text"
			className={"munhang-text" + (className ? " " + className : "")}
			style={style}
			value={localTitle}
			placeholder={placeholder}
			onChange={(e) => set_localTitle(e.target.value)}
			onBlur={() => onChange(localTitle)}
		/>
	);
}
