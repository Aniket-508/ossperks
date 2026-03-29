import type { Contact } from "@ossperks/core";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const personCardPartVariants = cva("", {
  compoundVariants: [
    { class: "size-12", part: "avatar", variant: "directory" },
    {
      class: "ring-fd-primary/20 size-16 ring-2",
      part: "avatar",
      variant: "featured",
    },
    { class: "text-lg", part: "fallback", variant: "directory" },
    { class: "text-xl", part: "fallback", variant: "featured" },
    {
      class:
        "group-hover:text-fd-primary truncate font-semibold transition-colors",
      part: "name",
      variant: "directory",
    },
    { class: "font-semibold", part: "name", variant: "featured" },
  ],
  defaultVariants: {
    variant: "directory",
  },
  variants: {
    part: {
      avatar: "",
      fallback: "",
      name: "",
    },
    variant: {
      directory: "",
      featured: "",
    },
  },
});

interface PersonCardProps extends Pick<
  VariantProps<typeof personCardPartVariants>,
  "variant"
> {
  href: string;
  avatarUrl: string | null;
  contact: Contact;
  subtitle?: string;
}

export const PersonCard = (props: PersonCardProps) => {
  const { href, avatarUrl, contact, subtitle, variant } = props;
  const initial = contact.name.charAt(0).toUpperCase();

  const avatar = (
    <Avatar
      className={cn(
        personCardPartVariants({ part: "avatar", variant }),
        variant === "featured" &&
          "ring-fd-primary/20 group-hover:ring-fd-primary/40 transition-all",
      )}
    >
      {avatarUrl ? <AvatarImage alt={contact.name} src={avatarUrl} /> : null}
      <AvatarFallback
        className={personCardPartVariants({ part: "fallback", variant })}
      >
        {initial}
      </AvatarFallback>
    </Avatar>
  );

  if (variant === "featured") {
    return (
      <Link className="group block" href={href}>
        <div className="ring-foreground/10 hover:bg-fd-accent flex flex-col items-center gap-3 rounded-xl p-8 ring-1 transition-colors">
          {avatar}
          <div className="text-center">
            <p className={personCardPartVariants({ part: "name", variant })}>
              {contact.name}
            </p>
            {subtitle ? (
              <p className="text-fd-muted-foreground text-sm">{subtitle}</p>
            ) : null}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link className="group block" href={href}>
      <div className="ring-foreground/10 hover:bg-fd-accent flex items-center gap-4 rounded-xl p-4 ring-1 transition-colors">
        {avatar}
        <div className="min-w-0 flex-1">
          <p className={personCardPartVariants({ part: "name", variant })}>
            {contact.name}
          </p>
          {subtitle ? (
            <p className="text-fd-muted-foreground truncate text-sm">
              {subtitle}
            </p>
          ) : null}
        </div>
        {contact.url ? (
          <ExternalLink className="text-fd-muted-foreground group-hover:text-fd-foreground size-4 shrink-0 transition-colors" />
        ) : null}
      </div>
    </Link>
  );
};
