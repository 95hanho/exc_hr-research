import { useMutation } from "@tanstack/react-query";
import { post_urlFormData } from "../../lib/apiFilter";
import API_URL from "../../api/endpoints";

export type Store_data_listInfo = {
	tesmi_idx: number;
	tesmi_status: number;
} & {
	[key: string]: string;
};

interface AdminSurveyResultSujuInfo {
	code: number;
	data: {
		remote_ip: string;
		store_data_list: Store_data_listInfo[];
		tesci_name: string;
	};
}

export function useAdminSurveyResultSuju() {
	return useMutation({
		mutationFn: async ({ surveyType, password }: { surveyType: string; password: string }) => {
			const res = await post_urlFormData(API_URL.ADMIN_SUJU, { surveyType, password });
			const result: AdminSurveyResultSujuInfo = res.data;
			return result;
		},
		/*
		// Mutation이 시작되기 직전에 특정 작업을 수행
		onMutate(a) {},
		onSuccess({ data }) {},
		onError(err) {},
		// 결과에 관계 없이 무언가 실행됨
		onSettled(data, err, params, context) {
			// console.log(data, err, params, context);
		},
        */
	});
}
