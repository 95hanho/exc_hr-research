import { Cookies } from "react-cookie";

const cookies = new Cookies();
// 모바일 여부 확인
export const isMobileDevice = (): boolean => {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};
// 토큰저장
export const setSurveyToken = (surveyType: string, surveyToken: string) => {
	cookies.set(surveyType, surveyToken, {
		path: "/",
		secure: true,
		expires: new Date(Date.now() + 60 * 60 * 1000 * 24), // 24시간
	});
};
// 토큰가져오기
export const getSurveyToken = (surveyType: string): string => {
	return cookies.get(surveyType);
};
// 토큰삭제
export const removeSurveyToken = (surveyType: string) => {
	cookies.remove(surveyType, { path: "/" });
};
// 해당 요소로 바로 이동
export const target_scrFocus_instant = (id: string) => {
	const target = document.getElementById(id);
	const scrEle = window;
	scrEle.scrollTo({
		top: target?.offsetTop,
		behavior: "instant", // 부드러운 스크롤
	});
};
// 포커스 또는 스크롤 - ref요소가 input이면 포커스, 아니면 이동
export const info_target_scrFocus = (element: HTMLElement | null) => {
	if (!element) return;

	if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
		element.focus();
	} else {
		element.scrollIntoView({ behavior: "smooth", block: "center" });
	}
};
// 포커스 또는 스크롤 - 변화되는 문항데이터 요소를 ref로 못가져오므로 id로 요소구함.
export const target_scrFocus = (id: string, scrId?: string) => {
	const target = document.getElementById(id);
	if (!target) return;

	// 스크롤 대상 요소
	const scrEle = scrId ? document.getElementById(scrId) : window;

	// input 또는 textarea인 경우 포커스
	if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
		target.focus();
	} else if (scrEle instanceof HTMLElement) {
		scrEle.scrollTo({
			top: target.offsetTop,
			behavior: "smooth",
		});
	} else if (scrEle === window) {
		window.scrollTo({
			top: target.offsetTop,
			behavior: "smooth",
		});
	}
};
// 문자열 복사
export const copyText = (text: string) => {
	navigator.clipboard
		.writeText(text)
		.then(() => {
			console.log("복사 완료");
		})
		.catch(() => {
			console.error("복사 실패");
		});
};
// \n -> <br>
export const nToBr = (text: string): string => (text ? text.replace(/\n/g, "<br>") : "");
// <br> -> \n
export const brToN = (text: string): string => (text ? text.replace(/<br>/g, "\n") : "");
