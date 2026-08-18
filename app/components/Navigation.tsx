"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: "⌂",
  },
  {
    name: "Businesses",
    href: "/businesses",
    icon: "▣",
  },
  {
    name: "Products",
    href: "/businesses",
    icon: "◈",
  },
  {
    name: "QR Codes",
    href: "/businesses",
    icon: "⌗",
  },
  {
    name: "Analytics",
    href: "/businesses",
    icon: "↗",
  },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen w-72 shrink-0 bg-[#0B1220] text-white lg:block">
      <div className="sticky top-0 flex min-h-screen flex-col">

        {/* Brand */}
        <div className="border-b border-white/10 px-6 py-6">
          <Link href="/dashboard" className="block">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-xl font-bold shadow-lg shadow-blue-500/20">
                QR
              </div>

              <div>
                <h1 className="text-lg font-bold tracking-tight">
                  Dynamic QR
                </h1>

                <p className="text-xs text-slate-400">
                  Business Platform
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-7">

          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Workspace
          </p>

          <div className="space-y-1.5">
            {navigation.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/dashboard" &&
                  pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-white text-slate-900 shadow-lg"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-base ${
                      active
                        ? "bg-slate-100 text-blue-600"
                        : "bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-white"
                    }`}
                  >
                    {item.icon}
                  </span>

                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          <p className="mb-3 mt-9 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Actions
          </p>

          <Link
            href="/businesses/new"
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <span className="text-lg">+</span>
            Create Business
          </Link>
        </nav>

        {/* Account */}
        <div className="border-t border-white/10 p-4">

          <div className="mb-3 rounded-xl bg-white/5 p-3">
            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-sm font-bold">
                A
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  Administrator
                </p>

                <p className="truncate text-xs text-slate-400">
                  Business Owner
                </p>
              </div>

            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              signOut({
                callbackUrl: "/login",
              })
            }
            className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            Sign out
          </button>
        </div>

      </div>
    </aside>
  );
}