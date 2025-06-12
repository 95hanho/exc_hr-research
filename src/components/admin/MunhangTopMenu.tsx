import React from "react";
import { useNavigate } from "react-router-dom";

interface MunhangTopMenuProps {
	top_menuList: string[];
	set_top_menuList: React.Dispatch<React.SetStateAction<string[]>>;
	surveyPage: string;
	surveyType: string;
	store_surveyInfo: () => boolean;
}

export default function MunhangTopMenu({ top_menuList, set_top_menuList, surveyPage, surveyType, store_surveyInfo }: MunhangTopMenuProps) {
	const navigate = useNavigate();

	return (
		<header className="top_menu">
			{top_menuList.map((cont, index) => (
				<a
					key={"top_menu" + index}
					className={surveyPage == String(index + 1) ? "-active" : ""}
					onClick={(e) => {
						e.preventDefault();
					}}
				>
					<input
						type="text"
						id={"top_menu_" + index}
						className="smooth-input"
						value={cont}
						onChange={(e) => {
							set_top_menuList((prev) => {
								const newList = [...prev];
								newList[index] = e.target.value;
								return newList;
							});
						}}
					/>
					{surveyPage != String(index + 1) && (
						<button
							className="btn btn-lg btn-warning"
							onClick={() => {
								if (store_surveyInfo()) navigate(`/admin/${surveyType}/${index + 1}`);
							}}
						>
							이동
						</button>
					)}

					{index > 0 && (
						<button
							className="topmenu-delete btn btn-lg btn-danger"
							onClick={() => {
								set_top_menuList((prev) => prev.filter((_, i) => i !== index));
							}}
						>
							-
						</button>
					)}
				</a>
			))}
			<a
				href="#"
				key={"top_menu"}
				onClick={(e) => {
					e.preventDefault();
					set_top_menuList((prev) => [...prev, ""]);
				}}
			>
				+
			</a>
		</header>
	);
}
