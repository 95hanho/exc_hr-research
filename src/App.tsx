import { useAppDispatch, useAppSelector } from "./hooks/useRedux";
import router from "./router/router";
import Providers from "./lib/providers";
import { RouterProvider } from "react-router-dom";
import { useSurveyCommonInfo } from "./hooks/survey/useSurveyCommonInfo";
import { useEffect } from "react";
import { CommonInfo } from "./types/common";
import { isMobileDevice } from "./lib/ui";
import Modal from "./components/modal/Modal";

const AppWrapper = ({ children }: Readonly<{ children: React.ReactNode }>) => {
	const curYear = useAppSelector((state) => state.common.curYear);
	const dispatch = useAppDispatch();
	const { data, isSuccess, isError } = useSurveyCommonInfo(curYear);

	useEffect(() => {
		if (isSuccess && data.result) {
			const obj: Partial<CommonInfo> = {};
			obj.color = String(data.result.backcolor);
			obj.start_date = data.result.start_date;
			obj.end_date = data.result.end_date;
			// 관리자 오픈
			if (data.remote_status) {
				if (data.ip_status) {
					obj.adminOn = data.remote_status;
					dispatch({ type: "modal/on_modal_alert", payload: `관리자 입장!설정 제한 해제` });
					obj.endStatus = false;
				} else {
					obj.endStatus = true;
					alert("2025 HR 실태조사는 5월에 오픈합니다.\n5월에 다시 만나요!");
					if (isMobileDevice()) {
						location.href = "https://m.exc.co.kr/hr_service/2-0";
					} else {
						location.href = "https://www.exc.co.kr/hr_service/report_buy_combine/report_info.asp?rptcd=RTT-Btbu120160314084647";
					}
				}
			}
			// 유저 오픈
			else {
				const now = new Date();
				const isBeforeStart = obj.start_date && new Date(obj.start_date) > now;
				const isAfterEnd = obj.end_date && new Date(obj.end_date) <= now;

				if (data.ip_status) {
					obj.adminOn = data.remote_status;
					obj.endStatus = false;
				} else {
					if (isBeforeStart || isAfterEnd) {
						obj.endStatus = true;
					} else {
						// 모바일 접근 제한 메시지
						if (isMobileDevice()) {
							alert("실태조사는 PC에서 편하게 이용할 수 있습니다.\nPC에서 진행해주세요.");
						}
						obj.endStatus = false;
					}
				}
			}
			dispatch({ type: "common/change_commonInfo", payload: obj });
		}
		// else {
		// 	dispatch({ type: "common/change_commonInfo", payload: { isExist: false } });
		// }

		if (isError) {
			dispatch({ type: "common/change_commonInfo", payload: { isExist: false } });
		}
	}, [curYear, data, isSuccess, isError, dispatch]);

	return children;
};

function App() {
	const commonInfo = useAppSelector((state) => state.common.commonInfo);

	return (
		<>
			<div id="wrapper" style={{ backgroundColor: commonInfo.color }}>
				<Providers>
					<AppWrapper>
						<Modal />
						<RouterProvider router={router} />
					</AppWrapper>
				</Providers>
			</div>
		</>
	);
}

export default App;
