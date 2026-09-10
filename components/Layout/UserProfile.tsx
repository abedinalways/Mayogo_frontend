import Image from "next/image";

interface UserProfileProps {
  name?: string;
  role?: string;
  avatarUrl?: string;
}

export function UserProfile({
  name = "Daniel Green",
  role = "Admin",
  avatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
}: UserProfileProps) {
  return (
    <div className="flex items-center gap-2.5">
      <Image
        src={avatarUrl}
        alt={name}
        width={36}
        height={36}
        className="h-9 w-9 rounded-full object-cover"
      />
      <div className="text-left">
        <p className="text-[13px] font-semibold leading-tight text-[#123e5e]">
          {name}
        </p>
        <p className="text-[11px] leading-tight text-[#6c8294]">{role}</p>
      </div>
    </div>
  );
}
