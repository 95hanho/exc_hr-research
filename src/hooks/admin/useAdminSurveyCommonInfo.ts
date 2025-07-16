import { useQuery } from "@tanstack/react-query";
import { get_normal } from "../../lib/apiFilter";
import API_URL from "../../api/endpoints";
import { AdminCommonInfo, AdminSurveyInfo } from "../../types/common";

interface AdminSurveyCommonInfo {
	code: number;
	result: {
		common_info: AdminCommonInfo;
		company_list: AdminSurveyInfo[];
	};
}

// 공통 정보 조회
export function useAdminSurveyCommonInfo(surveyYear: string) {
	return useQuery({
		queryKey: ["adminSurveyCommonInfo", { surveyYear }],
		queryFn: () => get_normal(API_URL.ADMIN_COMMON, { s_year: surveyYear }),
		select: ({ data }): AdminSurveyCommonInfo => {
			const common_info: AdminCommonInfo = {};
			common_info.color = data.result.common_info.backcolor;
			common_info.start_date = data.result.common_info.start_date;
			common_info.end_date = data.result.common_info.end_date;
			console.log(common_info);

			const company_list = data.result.company_list.map((v: Record<string, string>) => {
				return {
					survey_name: v.tesci_name,
					survey_url: v.tesci_url,
					survey_description: v.tesci_description,
				};
			});

			return {
				...data,
				result: {
					common_info,
					company_list,
				},
			};
		},
		enabled: !!surveyYear,
	});
}
