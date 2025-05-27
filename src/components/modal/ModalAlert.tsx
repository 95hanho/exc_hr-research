import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../hooks/useRedux";
import { uiAlarm } from "../../lib/modal";

export default function ModalAlert() {
	const dispatch = useDispatch();
	const modalOn = useAppSelector((state) => state.modal.modal_alert);
	const modalTxt = useAppSelector((state) => state.modal.modal_alert_txt);
	const modalEle = useRef(null);

	useEffect(() => {
		dispatch({ type: "modal/off_modal_alert" });
		if (modalOn) {
			uiAlarm.open(modalEle.current);
		}
	}, [modalOn, dispatch]);

	return (
		<>
			<div className="alarm">
				<div className="alarm-board" ref={modalEle}>
					<div className="alarm-content">
						<div className="alarm-title">알림창</div>
						<div className="alarm-con">
							<p dangerouslySetInnerHTML={{ __html: modalTxt }}></p>
							{/* <p>testestse</p> */}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
