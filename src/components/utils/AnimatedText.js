import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import styled from 'styled-components'
import gsap, { Power3, Power2 } from 'gsap'

const Text = styled.div`
	display: flex;
	align-items: center;
	padding: ${(props) => (props.type === 'navLink' || props.type === 'link' ? '12px' : '0')};
	cursor: ${(props) => (props.type === 'navLink' || props.type === 'link' ? 'pointer' : 'initial')};
	.textContainer {
		display: flex;
		overflow: hidden;
		span {
			display: inline-block;
			white-space: pre;
			transform: translateY(105%);
			pointer-events: none;
		}

		/* TYPES */
		.splashTitleTop {
			font-family: 'Made Outer Sans Thin';
			font-size: 1em;
			padding: 0 1px;
			user-select: none;
			mix-blend-mode: difference;
			line-height: 27px;
		}
		.splashTitleBottom {
			font-size: 2em;
			padding: 2 2;
			user-select: none;
			mix-blend-mode: difference;
			line-height: 52px;
		}
		.navTitle {
			height: 32px;
			/* width: 42px; */
			padding: 0 5px;
			font-size: 2.5em;
			line-height: 32px;
		}
		.navLink,
		.link {
			height: 11px;
			color: var(--grey);
			font-size: 0.8em;
			line-height: 11px;
			padding: 0 1px;
		}
		.designItemTitleIndex {
			height: 11px;
			color: var(--grey);
			font-family: 'Made Outer Sans Thin';
			font-size: 0.72em;
			line-height: 11px;
			padding: 0 0.5px;
		}
		.designItemTitleText {
			height: 11px;
			font-family: 'Made Outer Sans Light';
			font-size: 0.8em;
			line-height: 11px;
			padding: 0 0.5px;
		}
		.trackbarText {
			height: 13px;
			font-family: 'Made Outer Sans Light';
			font-size: 0.8em;
			line-height: 11px;
			padding: 0 0.3px;
		}
		.button {
			height: 10px;
			font-family: 'Made Outer Sans Regular';
			font-size: 0.8em;
			letter-spacing: 3px;
			line-height: 11px;
		}
	}
	transform: ${(props) => (props.type === 'navLink' ? 'rotate(-90deg)' : 'rotate(0)')};
`

const AnimatedText = forwardRef(({ text, type, stagger, delay, hover, displayAnim = true }, ref) => {
	let spans = []
	const spansRefs = useRef(new Array(text.length))
	const isAnimated = useRef(true)
	const removeAfterAnimate = useRef(false)

	for (let i = 0; i < text.length; i++) {
		spans.push(
			<span className={type} key={i} ref={(element) => (spansRefs.current[i] = element)}>
				{text[i]}
			</span>
		)
	}
	useEffect(() => {
		// Display it instantly if displayAnim = false
		// and animate it if displayAnim = true
		if (!displayAnim) {
			for (const _span of spansRefs.current) {
				_span.style.transform = 'translate(0%)'
			}
			isAnimated.current = false
		} else {
			setTimeout(() => {
				if (spansRefs.current[0] !== null) {
					gsap.to(spansRefs.current, {
						duration: 0.7,
						y: '0%',
						stagger: stagger,
						ease: Power3.easeOut,
						onComplete: () => {
							isAnimated.current = false
						},
					})
				}
			}, delay)
		}
	}, [stagger, delay, displayAnim])

	// Remove animation
	let remove = (delay) => {
		if (!isAnimated.current) {
			gsap.to(spansRefs.current, {
				duration: 0.7,
				y: '105%',
				stagger: stagger,
				ease: Power3.easeIn,
				delay: delay,
			})
		} else {
			removeAfterAnimate.current = true
		}
	}

	// Hover animation
	let hoverAnim = () => {
		isAnimated.current = true
		let delay = 0
		for (let i = 0; i < spansRefs.current.length; i++) {
			gsap.to(spansRefs.current[i], {
				duration: 0.3,
				delay: delay,
				y: '-105%',
				ease: Power2.easeIn,
				onComplete: () => {
					gsap.to(spansRefs.current[i], {
						duration: 0,
						y: '105%',
						onComplete: () => {
							gsap.to(spansRefs.current[i], {
								duration: 0.3,
								y: '0%',
								ease: Power2.easeOut,
							})
							if (i === spansRefs.current.length - 1) {
								isAnimated.current = false
								if (removeAfterAnimate.current) {
									remove()
								}
							}
						},
					})
				},
			})
			delay += 0.04
		}
	}

	useImperativeHandle(ref, () => ({
		// Replace text animation
		replace(text) {
			gsap.to(spansRefs.current, {
				duration: 0.5,
				y: '105%',
				stagger: stagger,
				ease: Power3.easeIn,
				onComplete: function () {
					for (let i = 0; i < spansRefs.current.length; i++) {
						spansRefs.current[i].innerHTML = text.charAt(i)
					}
					gsap.fromTo(spansRefs.current, { y: '-105%' }, { y: '0%', duration: 1, stagger: stagger, ease: Power3.easeOut })
				},
			})
		},

		// Unmount animation
		remove(delay) {
			remove(delay)
		},
	}))

	return (
		<Text
			type={type}
			onMouseEnter={() => {
				if (!isAnimated.current && hover) {
					hoverAnim()
				}
			}}
		>
			<div className="textContainer">{spans}</div>
		</Text>
	)
})
export default AnimatedText
