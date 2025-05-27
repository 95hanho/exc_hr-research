import { useEffect, useRef, useState } from "react";
import jspreadsheet, { WorksheetInstance } from "jspreadsheet-ce";
import "jspreadsheet-ce/dist/jspreadsheet.css";
import { uiModal } from "../../lib/modal";

export default function ModalJimoon({
	modalOn,
	set_modalOn,
	input_jimoon,
}: {
	modalOn: boolean;
	set_modalOn: (v: boolean) => void;
	input_jimoon: (excelData: string[][]) => void;
}) {
	const modalEle = useRef(null);
	const [excel, set_excel] = useState<WorksheetInstance | null>(null);
	const spreadsheetRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (modalOn) {
			uiModal.open(modalEle.current);
			if (spreadsheetRef.current) {
				const jex = jspreadsheet(spreadsheetRef.current, {
					worksheets: [
						{
							data: [[]],
							columns: [{ type: "text", title: "질문", width: "700px" }],
							// tableWidth: ["34%", "33%", "33%"],
						},
					],
				});
				set_excel(jex[0]);
			}
		} else {
			uiModal.close(modalEle.current);
			setTimeout(() => {
				if (excel) {
					excel.deleteWorksheet(0);
				}
			}, 500);
		}
	}, [modalOn]);
	return (
		<>
			<div className="modal-wrap" ref={modalEle}>
				<div className="modal">
					<div className="modal-background" onClick={() => set_modalOn(false)}></div>
					<div className="modal-board">
						<div className="modal-content">
							<div className="modal-title">알림창</div>
							<div className="modal-con">
								<div id="excelJimoon" ref={spreadsheetRef} style={{ width: "100%" }}></div>
							</div>
							<div className="complete-wrap">
								<p className="c_red">
									* 기타는 '기타'로 넣어주세요. 한 개만 가능
									<br />* 테이블 지문 입력 시 아래로 합칠 경우 합쳐질 칸을 비워두고 입력하기
									<br />* 붙여 넣을 때 줄바꿈이 있으면 다음 행으로 인식하므로 주의!
								</p>
								<button
									className="btn btn-primary"
									onClick={() => {
										if (!excel) return;
										const excelData = excel.getData() as string[][];
										if (excelData.length === 1 && excelData[0].length === 1 && !excelData[0][0]) {
											alert("값을 입력해주세요.");
										} else if (excelData.filter((v) => v[0] === "기타").length > 1) {
											alert("'기타'가 두 개 이상 있습니다.");
										} else {
											input_jimoon(excelData);
											set_modalOn(false);
										}
									}}
								>
									적용
								</button>
							</div>
							<div></div>
							<div className="modal-btn_wrap">
								<button type="button" className="modal_close" onClick={() => set_modalOn(false)}>
									닫기
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
