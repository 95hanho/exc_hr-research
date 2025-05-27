export const testData6 = {
	start_date: "2024-04-25",
	start_end: "2024-04-27",
	top_menus: ["I. 2022년도 교육관련 지표", "II. HRD 현황", "III. HRD 활동", "IV. HRD 이슈", "V. 기타 HR 활동", "test"],
	initData: {
		R_1_1_3: "",
		R_1_1_4: "",
		R_1_2_3: "",
		R_1_2_4: "",
		R_1_3_3: "",
		R_1_3_4: "",
		R_1_3_etc: "",
		/*  */
		R_2_1_2: "",
		R_2_1_3: "",
		R_2_1_4: "",
		R_2_1_5: "",
		R_2_1_6: "",
		R_2_1_7: "",
		R_2_1_8: "",
		R_2_1_9: "",
		R_2_2_2: "",
		R_2_2_3: "",
		R_2_2_4: "",
		R_2_2_5: "",
		R_2_2_6: "",
		R_2_2_7: "",
		R_2_2_8: "",
		R_2_2_9: "",
		R_2_th_9_etc: "",
		/*  */
		R_3_1_3: "",
		R_3_2_3: "",
		R_3_3_3: "",
		R_3_4_3: "",
		R_3_5_3: "",
		R_3_6_3: "",
		R_3_7_3: "",
		R_3_8_3: "",
		/*  */
		R_4_1_2: "",
		/*  */
		R_5_1_3: "",
		R_5_2_3: "",
		R_5_3_3: "",
		R_5_4_3: "",
		R_5_4_etc: "",
		/*  */
		R_6_1_3: "",
		R_6_1_4: "",
		R_6_2_3: "",
		R_6_2_4: "",
		R_6_3_3: "",
		R_6_3_4: "",
		R_6_4_3: "",
		R_6_4_4: "",
		R_6_4_etc: "",
		/*  */
		R_7_n_2: "",
		/*  */
		R_8_n_3_che: "",
		R_8_5_etc: "",
		/*  */
		R_9_n_3_rad: "",
		R_9_6_etc: "",
		/*  */
		R_10_n_3_f: "",
		R_10_n_3_b: "",
		R_10_3_etc: "",
		/*  */
		R_11_n_3_fWei: "",
		R_11_1_3_bWei: "",
		R_11_2_3_bWei: "",
		R_11_3_3_bWei: "",
		R_11_3_etc: "",
		/*  */
		R_12_multi: "",
		R_12_etc: "",
		/*  */
		R_13_multi: "",
		R_13_etc: "",
		/*  */
		R_14_etc: "",
		R_15_etc: "",
	},
	storeData: {},
	munhangs: [
		{
			title: "멀티테이블",
			questions: [
				{
					qType: "MultiTable",
					alert: null,
					subPadding: false,
					title: `비율테이블`,
					required: null,
					subContents: {
						table_th: ["No.", "문항내용", "현재 실시비율", "향후 실시비율<br>(1~3년 내)"],
						table_td: [
							["$index", "법정교육(안전, 성희롱 예방 등)", "R_per", "R_per"],
							["$index", "조직문화 관련 교육 (조직활성화, 소통, 비전 핵심가치 전파 등)", "R_per", "R_per"],
							["$index", "R_etc", "R_per", "R_per"],
							["$colSpan1|계", "-", "$total", "$total"],
						],
					},
				},
				{
					qType: "MultiTable",
					alert: null,
					subPadding: false,
					title: `가로비율 테이블`,
					required: null,
					subContents: {
						table_th: [
							"$width5%|",
							"집합 교육",
							"실시간<br>비대면교육*",
							"이러닝",
							"플립 러닝",
							"독서 통신<br>교육",
							"해외 연수",
							"국내외<br>학위연수",
							"R_etc",
							"계",
						],
						table_td: [
							["비율", "R_per", "R_per", "R_per", "R_per", "R_per", "R_per", "R_per", "R_per", "$totalRow"],
							["비율", "R_per", "R_per", "R_per", "R_per", "R_per", "R_per", "R_per", "R_per", "$totalRow"],
						],
					},
				},
				{
					qType: "MultiTable",
					alert: null,
					subPadding: false,
					title: `인적자원 테이블`,
					required: null,
					subContents: {
						table_th: ["No", "항목", "2023년 기준"],
						table_td: [
							["$rowSpan2|$index", "HRD 담당 인원수(사내강사를 제외한 인력)", "R_people"],
							["-", "사내강사를 보유하고 있는 경우, 해당 인원수(전담 사내강사)", "R_people"],
							["-", "사내강사를 보유하고 있는 경우, 해당 인원수(현업 병행 사내강사)", "R_people"],
							["$index", "HRD 담당 인원의 평균 HRD 업무 경력<br>(타 조직에서의 HRD 업무 경력 포함)", "R_year"],
							["$index", "	HRD 담당 인원 중 HRD 경력이 가장 긴 경우", "R_year"],
							["$index", "HRD 담당 인원 중 HRD 경력이 가장 짧은 경우", "R_year"],
							["$index", "$center|매출 총액*", "R_won"],
							["$index", "$center|채용 담당 인원 평균 채용 업무 경력*", "R_term"],
						],
					},
				},
				{
					qType: "MultiTable",
					alert: null,
					subPadding: false,
					title: `인원 테이블`,
					required: null,
					subContents: {
						table_th: ["구분", "교육시간"],
						table_td: [["$cenBold|인당 교육시간(평균)", "R_time"]],
					},
				},
				{
					qType: "MultiTable",
					alert: null,
					subPadding: false,
					title: `가중치테이블`,
					required: null,
					subContents: {
						topAlert: ["전혀 아님", "아님", "보통", "그러함", "매우 그러함"],
						table_th: ["No.", "문항", "$weight"],
						table_td: [
							["$index", "나는 현재보다 높은 직위의 업무를 수행하는 것은 어렵다고 생각된다.", "R_wei"],
							["$index", "나는 조직에서 나에게 주어지는 승진기회는 한계에 이르렀다고 생각된다.", "R_wei"],
							["$index", "나는 조직에서 상위직으로의 승진을 기대할 수 없는 곳까지 와있다.", "R_wei"],
							["$index", "R_etc", "R_wei"],
						],
					},
				},
				{
					qType: "MultiTable",
					alert: null,
					subPadding: false,
					title: `중요도, 수행도(가중치X2테이블)`,
					required: null,
					subContents: {
						topAlert: "weightDoubleFive",
						table_th: "weightDoubleFive",
						table_td: [
							["$index", "나는 현재보다 높은 직위의 업무를 수행하는 것은 어렵다고 생각된다.", "R_wei", "R_wei"],
							["$index", "나는 조직에서 나에게 주어지는 승진기회는 한계에 이르렀다고 생각된다.", "R_wei", "R_wei"],
							["$index", "나는 조직에서 상위직으로의 승진을 기대할 수 없는 곳까지 와있다.", "R_wei", "R_wei"],
							["$index", "R_etc", "R_wei", "R_wei"],
						],
					},
				},
				{
					qType: "MultiTable",
					alert: null,
					subPadding: false,
					title: `증가감소 테이블`,
					required: null,
					subContents: {
						table_th: "increaseDecrease",
						table_td: [
							["$cenBold|증가<br>3)번 문항 이동", "R_increDecre"],
							["$cenBold|감소<br>3)번 문항 이동, 해당 인원수(전담 사내강사)", "R_increDecre"],
						],
					},
				},
				{
					qType: "MultiTable",
					alert: null,
					subPadding: false,
					title: `복수선택(체크 테이블)`,
					required: null,
					subContents: {
						table_th: ["$width5%|No", "이슈", "체크"],
						table_td: [
							["$index", "교육에 대한 성과 검증", "R_check"],
							["$index", "경영 성과 향상을 위한 HRD", "R_check"],
							["$index", "역량중심의 교육체계", "R_check"],
							["$index", "역량 진단평가 솔루션", "R_check"],
							["$index", "R_etc", "R_check"],
						],
					},
				},
				{
					qType: "MultiTable",
					alert: null,
					subPadding: false,
					title: `단일선택(라디오 테이블)`,
					required: null,
					subContents: {
						center_name: "항목",
						table_th: ["No.", "항목", "체크"],
						table_td: [
							["$index", "교육활동 비용<br>(예: 낮은 교육 투자 비용, 비효율적인 집행 방법 등)", "R_radio"],
							["$index", "HRD 담당인력 (예: 교육 운영 및 개발 등 담당 인력 부족, 담당 인력의 전문성 부족 등)", "R_radio"],
							[
								"$index",
								"교육에 대한 조직(기관)의 인식 수준 (예: 경영층의 관심 부족, 이벤트성으로 진행되는 교육, 인사와의 연계성 부족 등)",
								"R_radio",
							],
							["$index", "교육활동에 필요한 시스템(IT)<br>(예: 시스템 부재, 시스템 운영인력 부족 등)", "R_radio"],
							["$index", "구성원의 참여의지<br>(예: 교육생의 소극적인 참여, 교육참여 부서의 비협조 등)", "R_radio"],
							["$index", "R_etc", "R_radio"],
							["$index", "방해원인 없음", "R_radio"],
						],
					},
				},
				{
					qType: "MultiTable",
					alert: null,
					subPadding: false,
					title: `연관체크 테이블`,
					required: null,
					subContents: {
						table_th: ["No.", "항목", "활용여부", "효과성"],
						table_td: [
							["$index", "asdfafsasdafs", "R_relCheck"],
							["$index", "asdfadsf", "R_relCheck"],
							["$index", "R_etc", "R_relCheck"],
						],
					},
				},
				{
					qType: "MultiTable",
					alert: null,
					subPadding: false,
					title: `연관가중치 테이블`,
					required: null,
					subContents: {
						table_th: [
							["$rowSpan1|No.", "$rowSpan1|항목", "$rowSpan1|체크", "$colSpan4|만족도"],
							["매우<br>낮음", "낮음", "보통", "높음", "매우<br>높음"],
						],
						table_td: [
							["$index", "asdfafsasdafs", "R_relWeight"],
							["$index", "asdfadsf", "R_relWeight"],
							["$index", "R_etc", "R_relWeight"],
						],
					},
				},
			],
		},
		{
			title: "다중객관식",
			subPadding: true,
			questions: [
				{
					qType: "MultiChoice",
					alert: {
						color: "info",
						content:
							"※ 원격교육 : 비대면 교육(화상교육)을 제외한 이러닝, 마이크로러닝, 독서통신교육 등 LMS(Learning Management System)을 활용한 온라인 교육을 대상으로 함",
					},
					subPadding: true,
					title: `1) 귀 조직은 원격교육을 실행하고 있거나 혹은 실행계획을 가지고 있습니까?`,
					required: null,
					subContents: {
						plural: false,
						choices: [
							{ content: "실행하고(실행 계획이) 있다.", notic: null },
							{ content: "없다.", notic: "미렁니ㅏ럼리;ㅓㄹㄴ" },
							{ content: "R_etc", notic: "밑에꺼 안해도됨!!" },
						],
					},
				},
				{
					qType: "MultiChoice",
					alert: null,
					subPadding: true,
					title: `2) 귀사(기관)가 현재 진행중인 원격교육 분야는 무엇입니까? (복수응답 가능)`,
					required: {
						R_12_multi: "2",
					},
					subContents: {
						plural: true,
						count: 2,
						requiredCount: true,
						choices: [
							{ content: "계층별, 승진자 교육(리더십)", notic: null },
							{ content: "직무공통 과정.", notic: null },
							{ content: "R_etc", notic: null },
						],
					},
				},
			],
		},
		{
			title: "기타텍스트",
			questions: [
				{
					qType: "EtcText",
					alert: null,
					subPadding: false,
					title: `설문 요청 엑스퍼트 직원 이름 재확인`,
					required: {
						R_12_multi: "2",
					},
					subContents: {
						placeholder: "afdsfdsfsddf",
						comment: "※귀하에게 요청한 엑스퍼트컨설팅 직원이 없으면 기입하지 않아도 됩니다.",
					},
				},
			],
		},
		{
			title: "기타텍스트 에어리어",
			questions: [
				{
					qType: "EtcTextarea",
					alert: null,
					subPadding: false,
					title: `1-2) 위 체크사항 중 중단/폐지한 제도가 있다면 그 이유나 배경을 간단히 작성해 주십시오.<br />(예) 학점이수제 폐지 사유 : 계층별 승진자 교육 폐지 또는 계층/직급 단순화 등`,
					required: {
						R_12_multi: "2",
					},
					subContents: {
						placeholder: "기타텍스트 에어리어 placeholder",
					},
				},
			],
		},
	],
};
