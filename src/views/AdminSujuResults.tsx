/* 관리자 수주직원용 결과 */
import { useState } from "react";
import { useParams } from "react-router-dom";
// import { serviceGetSurvey, serviceUpdateRecommend } from "../compositions/service";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import refresh from "/template/images/refresh.png";
import AllLoding from "../components/AllLoding";
import { Store_data_listInfo, useAdminSurveyResultSuju } from "../hooks/admin/useAdminSurveyResultSuju";
import { useAdminSurveyResultSujuSetMember } from "../hooks/admin/useAdminSurveyResultSujuSetMember";

export default function AdminSujuResults() {
	const { surveyType } = useParams() as { surveyType: string };
	const { mutate: surveyResultSuju } = useAdminSurveyResultSuju();
	const { mutate: setMember } = useAdminSurveyResultSujuSetMember();

	const [allLoding, set_allLoding] = useState(false);

	const [pwd, set_pwd] = useState("");
	const [type, set_type] = useState(1);
	const [title, set_title] = useState("");
	const [listOn, set_listOn] = useState(false);
	const [serviceList, set_serviceList] = useState<Store_data_listInfo[]>([]);
	const [complete_count, set_complete_count] = useState(0);
	const [rankObj, set_rankObj] = useState<Record<string, string | number>>({});
	const [connect_ip, set_connect_ip] = useState("");
	const permit_ip = ["121.167.96.194", "121.167.96.56", "121.167.96.109", "121.167.96.74"];

	const excelList1: Record<string, string | number>[] = [];
	const excelList2: Record<string, string | number>[] = [];

	const thList = [
		"No",
		"구분",
		"이름",
		"직급",
		"회사명",
		"부서명",
		"휴대폰번호",
		"사무실번호",
		"사업자등록번호",
		"설문참여진행",
		"요청담당자",
		"설문참여일",
	];

	const thStyle = [
		{},
		{
			minWidth: "70px",
		},
		{
			minWidth: "60px",
		},
		{
			minWidth: "60px",
		},
		{
			minWidth: "100px",
		},
		{},
		{},
		{},
		{},
		{
			minWidth: "60px",
		},
		{
			minWidth: "60px",
		},
		{
			minWidth: "100px",
		},
	];

	const sortFncBody = (obj: Record<string, string | number>, index: number): string | number => {
		switch (index) {
			case 1:
				return tran_R_Div(String(obj["R_Div"]));
			case 2:
				return obj["R_Name"];
			case 3:
				return obj["R_Position"];
			case 4:
				return obj["R_Company_Name"];
			case 5:
				return obj["R_Part_Name"];
			case 6:
				return obj["R_C_Tel_No"];
			case 7:
				return obj["R_Tel_No"];
			case 8:
				return obj["R_Biz_Reg_No"];
			case 9:
				return obj["tesmi_status"] === 0 ? "설문중" : "완료";
			case 10:
				return obj["recommend"];
			case 11:
				return String(obj["tesmi_regdate"]).substring(0, 16);
			default:
				return "";
		}
		function tran_R_Div(value: string): string {
			switch (Number(value)) {
				case 1:
					return "대기업";
				case 2:
					return "중기업";
				case 3:
					return "소기업";
				case 4:
					return "공공기관";
				case 5:
					return "대학교(대학)";
			}
			return "";
		}
	};

	const getService = async (e?: React.FormEvent) => {
		if (e) e.preventDefault();
		if (!pwd) {
			alert("비밀번호를 입력해주세요.");
			return;
		}
		set_allLoding(true);
		set_complete_count(0);
		const obj: Record<string, number> = {};
		surveyResultSuju(
			{ surveyType, password: pwd },
			{
				onSuccess(data) {
					console.log(data);
					set_allLoding(false);
					if (data.code === 200) {
						set_listOn(true);
						set_title(data.data.tesci_name);
						let ccount = 0;
						data.data.store_data_list.map((v) => {
							delete v["R_Cate"];
							delete v["R_Cate_Name"];
							// recommend
							if (v.tesmi_status == 10) {
								const recommend = v["recommend"] ? v["recommend"].trim() : "비어 있음";
								obj[recommend] = obj[recommend] ? obj[recommend] + 1 : 1;
							}
							if (v["tesmi_status"] == 10) ccount++;
						});
						set_complete_count(ccount);
						set_rankObj({ ...obj });
						set_serviceList(data.data.store_data_list);
						set_connect_ip(data.data.remote_ip.split(":")[0]);
					} else {
						alert("비밀번호가 일치하지 않습니다.\n다시 확인 해주세요.");
						document.getElementById("pwd")?.focus();
					}
				},
			}
		);
	};

	const change_recommend = (idx: number, before?: string) => {
		const name = prompt("요청담당자 이름을 입력해주세요.", before || undefined);
		if (name) {
			if (confirm(`'${name}'으로 변경하시겠습니까??`)) {
				setMember(
					{
						member_idx: idx,
						jusu_manager_name: name,
					},
					{
						onSuccess(data) {
							console.log(data);
							if (data.code === 200) getService();
							else alert("오류 발생\nIT전략실 문의바람.");
						},
						onError() {
							alert("오류 발생\nIT전략실 문의바람.");
						},
					}
				);
			}
		}
	};

	return (
		<div id="adminSurveyService">
			{allLoding && <AllLoding />}
			{!listOn && (
				<div className="authority-check">
					<form onSubmit={getService}>
						Pwd :{" "}
						<input
							id="pwd"
							type="password"
							autoComplete="false"
							className="form-control"
							placeholder="비밀번호를 입력해주세요."
							value={pwd}
							onChange={(e) => set_pwd(e.target.value)}
						/>{" "}
						<input type="submit" className="btn btn-success" />
					</form>
				</div>
			)}
			{listOn && (
				<div style={{ minWidth: "970px" }}>
					<h1>{title}</h1>
					<div className="tab">
						<button className={"btn btn-default" + (type === 1 ? " active" : "")} onClick={() => set_type(1)}>
							설문결과
						</button>
						<button className={"btn btn-default" + (type === 2 ? " active" : "")} onClick={() => set_type(2)}>
							순위
						</button>
						{type === 1 && (
							<div style={{ display: "inline-block", fontSize: "20px", verticalAlign: "middle" }}>
								&nbsp;&nbsp;전체: <span className="f-bold">{serviceList.length}</span>, 완료:{" "}
								<span className="c_green f-bold">{complete_count}</span>, 설문중:{" "}
								<span className="c_red f-bold">{serviceList.length - complete_count}</span>
							</div>
						)}

						<button className="f-right re" onClick={getService}>
							<span className="material-symbols-outlined">refresh</span>
						</button>
						<div className="f-right">
							<ExportToExcel data={type == 1 ? excelList1 : excelList2} title={title} type={type} />
						</div>
					</div>
					{type === 1 && (
						<>
							{serviceList.length > 0 && (
								<table className="table table-striped table-bordered align-middle">
									<thead>
										<tr>
											{thList.map((key, i) => {
												return (
													<th key={"resultTh" + i} style={thStyle[i]}>
														{key}
													</th>
												);
											})}
										</tr>
									</thead>
									<tbody>
										{serviceList.map((service, i) => {
											const obj: { no?: number } & { [key: string]: string | number } = {};
											const ele = (
												<tr key={"service" + i}>
													{thList.map((key, i2) => {
														if (i2 === 0) {
															obj.no = i + 1;
															return <td key={"resultTd" + i2}>{i + 1}</td>;
														} else if (i2 === 10) {
															obj[key] = sortFncBody(service, i2);
															if (permit_ip.includes(connect_ip) && !sortFncBody(service, i2)) {
																return (
																	<td key={"resultTd" + i2}>
																		<button
																			className="btn btn-info"
																			onClick={() => change_recommend(service.tesmi_idx)}
																		>
																			입력하기
																		</button>
																	</td>
																);
															} else if (permit_ip.includes(connect_ip) && sortFncBody(service, i2)) {
																return (
																	<td key={"resultTd" + i2}>
																		<button
																			className="modify"
																			onClick={() =>
																				change_recommend(
																					Number(service.tesmi_idx),
																					String(sortFncBody(service, i2))
																				)
																			}
																		>
																			{sortFncBody(service, i2)}
																			<img src={refresh} alt="수정버튼" />
																		</button>
																	</td>
																);
															} else {
																return <td key={"resultTd" + i2}>{sortFncBody(service, i2)}</td>;
															}
														} else if (i2 === 9) {
															const result = sortFncBody(service, i2);
															obj[key] = result;
															return (
																<td key={"resultTd" + i2}>
																	{result === "설문중" && <span className="c_red f-bold">설문중</span>}
																	{result === "완료" && <span className="c_green f-bold">완료</span>}
																</td>
															);
														} else {
															obj[key] = sortFncBody(service, i2);
															return (
																<td
																	key={"resultTd" + i2}
																	dangerouslySetInnerHTML={{ __html: sortFncBody(service, i2) }}
																/>
															);
														}
													})}
												</tr>
											);
											excelList1.push(obj);
											return ele;
										})}
									</tbody>
								</table>
							)}
						</>
					)}
					{type === 2 && (
						<table className="table table-striped table-bordered align-middle">
							<thead>
								<tr>
									<th>No</th>
									<th>담당자</th>
									<th>갯수</th>
								</tr>
							</thead>
							<tbody>
								{(() => {
									const ele = [];
									let count = 0;

									ele.push(
										Object.entries(rankObj)
											.sort((a, b) => {
												if (a[0] === "비어 있음") return 1;
												if (b[0] === "비어 있음") return -1;
												return Number(b[1]) - Number(a[1]);
											})
											.map((entry, i) => {
												const obj = {
													No: i + 1,
													["담당자"]: entry[0],
													["갯수"]: entry[1],
												};
												count += Number(entry[1]);
												excelList2.push(obj);
												return (
													<tr key={"entry" + i}>
														<td>{i + 1}</td>
														<td>{entry[0]}</td>
														<td>{entry[1]}</td>
													</tr>
												);
											})
									);
									ele.push(
										<tr key={"total"}>
											<td>TOTAL</td>
											<td colSpan={2}>{count}</td>
										</tr>
									);
									return ele;
								})()}
							</tbody>
						</table>
					)}
				</div>
			)}
		</div>
	);
}

const ExportToExcel = ({ data, title, type }: { data: Record<string, string | number>[]; title: string; type: number }) => {
	const exportToExcel = () => {
		// Create a new workbook and a worksheet
		const wb = XLSX.utils.book_new();
		const ws = XLSX.utils.json_to_sheet(data);

		// Append the worksheet to the workbook
		XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

		// Generate buffer
		const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

		// Save to file
		const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
		saveAs(blob, `${title}_${type === 1 ? "결과" : "순위표"}.xlsx`);
	};

	return (
		<button className="btn btn-success" onClick={exportToExcel}>
			{`${title}_${type === 1 ? "결과" : "순위표"}.xlsx`}
		</button>
	);
};
