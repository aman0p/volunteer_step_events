"use client";

import ExpandableText from "@/components/ExpandableText";

export default function DescriptionClient({ text }: { text: string }) {
   return <ExpandableText text={text} clampLines={3} />;
}
