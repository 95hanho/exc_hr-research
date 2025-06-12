import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

interface MunhangTopMenuProps {
	top_menuList: string[];
	surveyPageNum: number;
	surveyType: string;
	testView: boolean;
	email: string;
	clickPrevent: boolean;
	set_clickPrevent: React.Dispatch<boolean>;
	dataSave: () => void;
	submit_resultData: () => Promise<boolean>;
	progress_raw: boolean[];
}

export default function MunhangTopMenu({
	top_menuList,
	surveyPageNum,
	surveyType,
	testView,
	email,
	clickPrevent,
	set_clickPrevent,
	dataSave,
	submit_resultData,
	progress_raw,
}: MunhangTopMenuProps) {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	return (
		<header className="top_menu">
			{top_menuList.map((cont, index) => (
				<a
					href="#"
					key={"top_menu" + index}
					className={surveyPageNum == index + 1 ? "-active" : ""}
					onClick={(e) => {
						e.preventDefault();
						if (testView)
							navigate(`/survey/${surveyType}/${index + 1}`, {
								state: {
									email,
								},
							});
						else if (!clickPrevent) {
							set_clickPrevent(true);
							setTimeout(() => {
								set_clickPrevent(false);
							}, 2000);
							if (surveyPageNum > index + 1) {
								dataSave();
								navigate(`/survey/${surveyType}/${index + 1}`, {
									state: {
										email,
									},
								});
							} else {
								if (surveyPageNum != index + 1) {
									submit_resultData().then((result) => {
										if (result) {
											if (progress_raw.slice(0, index).every((v) => v)) {
												navigate(`/survey/${surveyType}/${index + 1}`, {
													state: {
														email,
													},
												});
											} else
												dispatch({
													type: "modal/on_modal_alert",
													payload: "설문을 순서대로 진행해주세요.",
												});
										}
									});
								}
							}
						} else {
							dispatch({ type: "modal/on_modal_alert", payload: "잠시만 기다려주세요." });
						}
					}}
				>
					{cont}
				</a>
			))}
		</header>
	);
}
