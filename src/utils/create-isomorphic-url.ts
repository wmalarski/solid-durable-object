import { createMemo } from "solid-js";
import { getRequestEvent } from "solid-js/web";

export const createIsomorphicUrl = () => {
	return createMemo(() => {
		const href = getRequestEvent()?.request.url || window.location.href;
		return new URL(href);
	});
};
