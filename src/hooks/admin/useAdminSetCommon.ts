import { post_urlFormData } from "../../api/apiFilter";
import API_URL from "../../api/endpoints";
import { useMutation } from "@tanstack/react-query";
import { AdminCommonInfo } from "../../types/common";

interface AdminSetCommonParam extends AdminCommonInfo {
	surveyYear: string;
}

// 공통 설문정보 수정
export function useAdminSetCommon() {
	return useMutation({
		mutationFn: async ({ color, start_date, end_date, open_status, surveyYear }: AdminSetCommonParam) => {
			const res = await post_urlFormData(API_URL.ADMIN_COMMON_SET, { color, start_date, end_date, open_status, s_year: surveyYear });
			return res.data;
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
