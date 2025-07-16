/* 관리자 공통사항 및 설문별 설정 */
import { forwardRef, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale/ko";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import moment from "moment";
import { useAppDispatch } from "../hooks/useRedux";
import { useAdminSurveyCommonInfo } from "../hooks/admin/useAdminSurveyCommonInfo";
import { AdminCommonInfo, AdminSurveyInfo } from "../types/common";
import { useAdminSetCommon } from "../hooks/admin/useAdminSetCommon";
import { useAdminSurveyInfo } from "../hooks/admin/useAdminSurveyInfo";

type CustomInputProps = {
	value?: string;
	onClick?: () => void;
};

/* forwardRef : 전달된 ref를 얻고, 그것을 렌더링 되는 DOM button으로 전달합니다. */
const ExampleCustomInput = forwardRef<HTMLButtonElement, CustomInputProps>(({ value, onClick }, ref) => (
	<button className="example-custom-input" onClick={onClick} ref={ref}>
		{value}
	</button>
));

export default function AdminSettings() {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { surveyYear } = useParams() as { surveyYear: string };

	const { isSuccess, data: adminCommonData, refetch } = useAdminSurveyCommonInfo(surveyYear);
	const { mutate: adminSetCommon } = useAdminSetCommon();
	const { mutate: adminSetSurveyInfo } = useAdminSurveyInfo();

	// 현재 설문 리스트
	const [makingList, set_makingList] = useState<AdminSurveyInfo[]>([]);
	// 공통배경 관리
	const [commonInfo, set_commonInfo] = useState<AdminCommonInfo>({
		color: "",
		start_date: "",
		end_date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
	});
	const [date1, set_date1] = useState<Date>(new Date(`${new Date().getFullYear()}-01-01`));
	const [date2, set_date2] = useState<Date>(new Date());

	const save_before = () => {
		if (date1 > date2) {
			dispatch({ type: "modal/on_modal_alert", payload: "시작일이 앞 설 수 없습니다." });
			return;
		}
		adminSetCommon(
			{
				...commonInfo,
				surveyYear,
			},
			{
				onSuccess: (data) => {
					if (data.code === 200) {
						dispatch({ type: "modal/on_modal_alert", payload: "저장/수정 완료" });
						refetch();
					} else if (data.code === 403) {
						dispatch({ type: "modal/on_modal_alert", payload: "이미 등록된 URL입니다." });
					}
				},
			}
		);
	};

	// 수정중인지
	const [modifyOn, set_modifyOn] = useState(false);
	// 설문페이지만들기 인포
	const [initSurvey, set_initSurvey] = useState({
		survey_name: "",
		survey_url: "",
		survey_description: "",
	});
	const create_survey = () => {
		if (!initSurvey.survey_name.length) {
			dispatch({ type: "modal/on_modal_alert", payload: "설문이름을 입력해주세요." });
			document.getElementById("survey_name")?.focus();
		} else if (!initSurvey.survey_url.length) {
			dispatch({ type: "modal/on_modal_alert", payload: "url을 입력해주세요." });
			document.getElementById("survey_url")?.focus();
		} else {
			adminSetSurveyInfo(
				{ ...initSurvey, surveyYear },
				{
					onSuccess: (data) => {
						if (data.code === 200) {
							dispatch({ type: "modal/on_modal_alert", payload: "저장/수정 완료" });
							refetch();
						} else if (data.code === 403) {
							dispatch({ type: "modal/on_modal_alert", payload: "이미 등록된 URL입니다." });
						}
					},
				}
			);
		}
	};

	useEffect(() => {
		if (isSuccess) {
			set_date1(new Date(adminCommonData.result.common_info.start_date as string));
			set_date2(new Date(adminCommonData.result.common_info.end_date as string));
			set_commonInfo((prev) => {
				return {
					...prev,
					color: adminCommonData.result.common_info.color,
					start_date: adminCommonData.result.common_info.start_date,
					end_date: adminCommonData.result.common_info.end_date,
				};
			});
			set_makingList([...adminCommonData.result.company_list]);
		}
	}, [adminCommonData, isSuccess]);

	return (
		<>
			<div id="adminMain">
				<h1>{surveyYear}년도 실태조사 관리자</h1>
				<h2>&lt;공통 설정 관리자&gt;</h2>
				<div className="admin-set">
					<div>
						배경색 :{" "}
						<input
							type="text"
							className="form-control"
							value={commonInfo.color || ""}
							onChange={(e) => {
								set_commonInfo({ ...commonInfo, color: e.target.value });
							}}
						/>
					</div>
					<div className="admin-initForm">
						<div>
							설문기간 :
							<DatePicker
								locale={ko}
								dateFormat={"yyyy-MM-dd HH:mm"}
								shouldCloseOnSelect // 날짜를 선택하면 datepicker가 자동으로 닫힘
								selected={date1}
								onChange={(date) => {
									if (date) set_date1(date);
									commonInfo.start_date = moment(date).format("YYYY-MM-DD HH:mm:ss");
									set_commonInfo({ ...commonInfo });
								}}
								customInput={<ExampleCustomInput />}
								showTimeSelect
							/>{" "}
							~{" "}
							<DatePicker
								locale={ko}
								dateFormat={"yyyy-MM-dd HH:mm"}
								shouldCloseOnSelect // 날짜를 선택하면 datepicker가 자동으로 닫힘
								selected={date2}
								onChange={(date) => {
									if (date) set_date2(date);
									commonInfo.end_date = moment(date).format("YYYY-MM-DD HH:mm:ss");
									set_commonInfo({ ...commonInfo });
								}}
								customInput={<ExampleCustomInput />}
								showTimeSelect
							/>
						</div>
					</div>
					{/* <div className="user-open">
						상태 :{" "}
						<select
							name=""
							id=""
							className="form-control"
							value={String(commonInfo.open_status)}
							onChange={(e) => {
								set_commonInfo({ ...commonInfo, open_status: Number(e.target.value) as 1 | 2 });
							}}
						>
							<option value="1">관리자오픈</option>
							<option value="2">유저오픈</option>
						</select>
					</div> */}
					<div>
						<button className="btn btn-info" onClick={save_before}>
							저장
						</button>
					</div>
				</div>
				{/* <h2>&lt;메인페이지 관리&gt;</h2>
				<div className="admin-set">
					<div></div>
					<div>
						왼쪽 설문: 제 <input type="text" className="form-control" />
						회,{" "}
						<select name="" id="" className="form-control">
							<option value="">없음</option>
							{makingList.map((making, i) => (
								<option key={"making" + i} value={making.tesci_url}>
									{making.tesci_url}
								</option>
							))}
						</select>
					</div>
					<div>
						오른쪽 설문: 제 <input type="text" className="form-control" />
						회,{" "}
						<select name="" id="" className="form-control">
							<option value="">없음</option>
							{makingList.map((making, i) => (
								<option key={"making" + i} value={making.tesci_url}>
									{making.tesci_url}
								</option>
							))}
						</select>
					</div>
				</div> */}
				<h2>&lt;설문페이지 관리&gt;</h2>
				<div>
					{makingList.map((make, makeIdx) => {
						return (
							<button
								key={"make" + makeIdx}
								className="btn btn-default"
								onClick={() => {
									set_modifyOn(true);
									set_initSurvey({
										survey_name: make.survey_name,
										survey_url: make.survey_url,
										survey_description: make.survey_description || "",
									});
								}}
							>
								{make.survey_name}({make.survey_url})
							</button>
						);
					})}
				</div>
				<br></br>
				{modifyOn && (
					<>
						<div className="admin-set">
							<div>
								설문이름 :
								<input
									id="survey_name"
									type="text"
									className="form-control"
									placeholder="설문이름을 입력해주세요."
									value={initSurvey.survey_name}
									onChange={(e) => {
										set_initSurvey({ ...initSurvey, survey_name: e.target.value });
									}}
								/>
							</div>
							<div>
								url :{" "}
								<input
									id="survey_url"
									type="text"
									className="form-control"
									placeholder="url을 입력해주세요."
									value={initSurvey.survey_url}
									onChange={(e) => {
										set_initSurvey({ ...initSurvey, survey_url: e.target.value });
									}}
									readOnly={modifyOn}
								/>
							</div>
							<div>
								description :{" "}
								<input
									type="text"
									className="form-control"
									placeholder="description을 입력해주세요."
									value={initSurvey.survey_description}
									onChange={(e) => {
										set_initSurvey({ ...initSurvey, survey_description: e.target.value });
									}}
								/>
							</div>
						</div>
						<br></br>
						<div>
							<button onClick={create_survey} className="btn btn-warning">
								수정
							</button>
							<button
								className="btn btn-danger"
								onClick={() => {
									set_modifyOn(false);
									set_initSurvey({
										survey_name: "",
										survey_url: "",
										survey_description: "",
									});
								}}
							>
								취소
							</button>
							<button
								className="btn btn-success"
								onClick={() => {
									navigate(`/admin/${initSurvey.survey_url}/1`);
									// navigate(`/admin/${initSurvey.survey_url}`);
								}}
							>
								다음설정으로
							</button>
							<button
								className="btn btn-primary"
								onClick={() => {
									navigate(`/admin/${initSurvey.survey_url}/result/0`);
								}}
							>
								결과보기
							</button>
							{/* <button className="btn btn-info" onClick={create_survey}>
								만들기 시작
							</button> */}
						</div>
					</>
				)}
			</div>
		</>
	);
}
