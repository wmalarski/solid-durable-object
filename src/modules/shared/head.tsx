import { Meta, Title } from "@solidjs/meta";
import { type Component, createMemo } from "solid-js";
import { createIsomorphicUrl } from "~/modules/shared/create-isomorphic-url";
import { useI18n } from "../../utils/i18n";

type HeadProps = {
  description?: string;
  title?: string;
};

export const Head: Component<HeadProps> = (props) => {
  const { t } = useI18n();

  const title = createMemo(() => {
    return props.title ? `${props.title} - ${t("seo.title")}` : t("seo.title");
  });

  const description = createMemo(() => {
    return props.description ?? t("seo.description");
  });

  const url = createIsomorphicUrl();

  const ogUrl = createMemo(() => {
    return `${url().origin}${url().pathname}`;
  });

  return (
    <>
      <Title>{title()}</Title>
      <Meta content={description()} name="description" />
      <Meta content={title()} property="og:title" />
      <Meta content={description()} property="og:description" />
      <Meta content="website" property="og:type" />
      <Meta content={ogUrl()} property="og:url" />
      <Meta content={`${url().origin}/og-image.png`} property="og:image" />
      <Meta content="461" property="og:image:width" />
      <Meta content="460" property="og:image:height" />
    </>
  );
};
