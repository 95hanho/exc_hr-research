import $ from "jquery";

export const uiAlarm = {
	// 모달창 오픈
	openIndex: 0,
	open(target: HTMLElement | null) {
		if (!target) return;
		clearTimeout(this.openIndex);
		const height = $(target).height();
		$(target)
			.stop()
			.show(0)
			.css("top", `-${height}px`)
			.fadeIn(0)
			.animate(
				{
					top: 0,
				},
				500,
				function () {
					uiAlarm.openIndex = setTimeout(() => {
						$(target).fadeOut(1000);
					}, 3000);
				}
			);
	},
	// 모달창 닫기
	close(target: HTMLElement | null) {
		if (!target) return;
		if (!$(target).hasClass("active")) $(target).hide();
		else {
			$(target).removeClass("active").addClass("delay");
			setTimeout(() => {
				$(target).hide();
			}, 300);
		}
	},
};

export const uiModal = {
	// 모달창 오픈
	open(target: HTMLElement | null) {
		if (!target) return;
		$(target).show().children().removeClass("delay").addClass("active");
	},
	// 모달창 닫기
	close(target: HTMLElement | null) {
		if (!target) return;
		if (!$(target).children().hasClass("active")) $(target).hide();
		else {
			$(target).children().removeClass("active").addClass("delay");
			setTimeout(() => {
				$(target).hide();
			}, 300);
		}
	},
};
