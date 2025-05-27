import { useMutation } from "@tanstack/react-query";
import { post_urlFormData } from "../../lib/apiFilter";
import API_URL from "../../api/endpoints";

export function useAdminSurveyResultSujuSetMember() {
	return useMutation({
		mutationFn: async ({ member_idx, jusu_manager_name }: { member_idx: number; jusu_manager_name: string }) => {
			const res = await post_urlFormData(API_URL.ADMIN_SUJU_MEMBER, { member_idx, jusu_manager_name });
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
