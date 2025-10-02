"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

 const slides = [
	"/assets/herocarousel/1.jpg",
	"/assets/herocarousel/2.jpg",
	"/assets/herocarousel/3.jpg",
	"/assets/herocarousel/4.jpg",
	"/assets/herocarousel/5.jpg",
 ];

export default function HeroCarousel() {
	const [index, setIndex] = React.useState(0);
	const containerRef = React.useRef<HTMLDivElement | null>(null);
	const [offsetY, setOffsetY] = React.useState(0);

	const captions = React.useMemo(
		() => [
			{
				title: "Buy $BUALOI, Save Lives.",
				subtitle: "Every trade pushes real aid to people in need.",
			},
			{
				title: "100% Transparent On-Chain",
				subtitle: "Track funds, verify impact, trust the flow.",
			},
			{
				title: "Meme + Charity + Solidarity",
				subtitle: "Easy to spread, easy to trust.",
			},
		],
		[]
	);

	React.useEffect(() => {
		const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
		return () => clearInterval(id);
	}, []);

	React.useEffect(() => {
		const onScroll = () => {
			const y = window.scrollY || 0;
			setOffsetY(y * 0.2);
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

    return (
        <div ref={containerRef} className="relative w-full overflow-hidden bg-background">
            <div className="relative w-full">
                <div className="relative w-full aspect-[16/9] md:aspect-[16/6]">
					{slides.map((src, i) => (
						<div
							key={src}
							className={cn(
								"absolute inset-0 transition-opacity duration-700",
								i === index ? "opacity-100" : "opacity-0"
							)}
							style={{ transform: `translateY(${i === index ? offsetY * -0.2 : 0}px)` }}
						>
                            <div className="absolute inset-0 overflow-hidden bg-black">
								<Image
									src={src}
									alt="Hero slide"
									fill
                                    sizes="100vw"
                                    className={cn("object-cover will-change-transform", i === index ? "animate-zoom-slow" : "")}
									priority={i === index}
								/>
								{/* bottom shadow overlay */}
								<div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
								
								{/* horizontal gradient overlay for fade effect */}
								<div className="pointer-events-none absolute inset-0 z-10">
									{/* Left fade */}
									<div className="absolute left-0 top-0 bottom-0 w-1/6 bg-gradient-to-r from-background to-transparent"></div>
									{/* Right fade */}
									<div className="absolute right-0 top-0 bottom-0 w-1/6 bg-gradient-to-l from-background to-transparent"></div>
								</div>
							</div>
						</div>
					))}
					{/* captions */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0">
                        <div className="mx-auto max-w-6xl px-4 py-10">
                            <div className="max-w-2xl pb-6">
								<h2 className="font-serif text-white text-3xl md:text-5xl font-bold leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
									{captions[index % captions.length].title}
								</h2>
								<p className="mt-2 text-white/90 text-base md:text-lg leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
									{captions[index % captions.length].subtitle}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}


