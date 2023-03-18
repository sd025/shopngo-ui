import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import gsap, { Power1, Power2 } from 'gsap'
import { useHistory } from 'react-router-dom'

import config from '../../../assets/config.json'
import AnimatedText from '../../utils/AnimatedText'
import AnimatedSentence from '../../utils/AnimatedSentence'
import Button from '../../utils/Button'
import DesignTitle from '../../utils/DesignTitle'
import { ReactComponent as NewKeyButtonImage } from '../../../assets/newKey.svg'

import * as tf from "@tensorflow/tfjs";
// 1. TODO - Import required model here
// e.g. import * as tfmodel from "@tensorflow-models/tfmodel";
import Webcam from "react-webcam";

import { model } from "@tensorflow/tfjs";
// 2. TODO - Import drawing utility here
// e.g. import { drawRect } from "./utilities";

import  axios  from 'axios';
import { drawRect } from '../../utilities'

const Container = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	.leftContainer {
		position: relative;
		width: 75%;
		height: 100%;
		.returnButton {
			position: absolute;
			top: 35px;
			left: 40px;
		}
		.designTitleContainer {
			position: absolute;
			bottom: 54px;
			left: 60px;
		}
		.selectButtonContainer {
			position: absolute;
			bottom: 54px;
			right: 60px;
		}
	}
	.line {
		width: var(--menuLineSize);
		height: 100%;
		background: var(--white);
		transform-origin: top;
		transform: scaleY(0);
	}
	.rightContainer {
		width: calc(25% - var(--menuLineSize));
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 35px;
		.customSentenceContainer {
			width: 80%;
			margin-bottom: 35px;
		}
		.keyInput {
			position: relative;
			width: 80%;
			height: 40px;
			display: flex;
			margin-bottom: 42px;
			.keyInputMask {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background: var(--black);
				transform-origin: right;
			}
			.input {
				width: calc(100% - 40px);
				height: 100%;
				color: var(--white);
				border: 1px solid var(--white);
				background: var(--black);
				padding: 0 10px;
				font-size: 1.2em;
				letter-spacing: 3px;
				&:focus {
					outline: none;
				}
			}
			.newKeyButton {
				width: 40px;
				height: 100%;
				border-top: 1px solid var(--white);
				border-right: 1px solid var(--white);
				border-bottom: 1px solid var(--white);
				background: var(--black);
				display: flex;
				justify-content: center;
				align-items: center;
				user-select: none;
				cursor: pointer;
				svg {
					width: 50%;
					fill: var(--white);
				}
				&:hover {
					background: var(--white);
					svg {
						fill: var(--black);
					}
				}
				&:active {
					svg {
						fill: var(--white);
					}
				}
			}
		}
		.trackbarsContainer {
			width: 100%;
			height: 0;
			overflow: hidden;
		}
	}
`

export default function Custom({ navTitleRef, delay }) {
	const line = useRef(null)
	const returnButton = useRef(null)
	const sketch = useRef(null)
	const keyInput = useRef(null)
	const keyInputMask = useRef(null)
	const customSentence = useRef(null)
	const customSentenceContainer = useRef(null)
	const trackbarsContainer = useRef(null)
	const trackbarsRefs = useRef([])
	const customButton = useRef(null)

	const [buttonIsDisable, setButtonIsDisable] = useState(true)
	const [isFirstTimeGenerated, setIsFirstTimeGenerated] = useState(false)
	const [canSelect, setCanSelect] = useState(false)
	const [quantity, setQuantity] = useState(1);

	const history = useHistory()

	// Get design config
	let design
	const slug = history.location.pathname.substring(history.location.pathname.lastIndexOf('/') + 1)
	for (const _design of config) {
		if (_design.slug === slug) {
			design = _design
		}
	}

	function updateGenerateButton() {
		keyInput.current.value.length > 0 ? setButtonIsDisable(false) : setButtonIsDisable(true)
	}

	function transitionToTrackbars() {
		setIsFirstTimeGenerated(true)
		customSentence.current.remove()
		gsap.to(customSentenceContainer.current, { duration: 1.3, height: 0, marginBottom: 0, delay: 0.27, ease: Power2.easeInOut })
		gsap.to(trackbarsContainer.current, { duration: 1.5, height: 'auto', marginBottom: '25px', delay: 0.2, ease: Power2.easeInOut })
	}

	useEffect(() => {
		const lineEase = delay === 0 ? Power2.easeOut : Power2.easeInOut
		gsap.to(line.current, { duration: 1.2, scaleY: 1, ease: lineEase, delay: delay + 1.2 })
		gsap.to(keyInputMask.current, { duration: 0.85, scaleX: 0, ease: Power2.easeInOut, delay: delay + 1.5 })
	}, [delay])
//tw tw tw
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [name, setName] = useState("");
  // Main function
  const runCoco = async () => {
    // 3. TODO - Load network
    // e.g. const net = await cocossd.load();
    // C:\Users\ASUS\Desktop\Python Project\ember\Shop-n-Go\RealTimeObjectDetection-main\Tensorflow\workspace\models\my_ssd_mobnet\converted\model.json
    const net = await tf.loadGraphModel("http://127.0.0.1:3004/model.json");

    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 16.7);
  };

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // 4. TODO - Make Detections
      // e.g. const obj = await net.detect(video);

      const img = tf.browser.fromPixels(video);
      const resized = tf.image.resizeBilinear(img, [640, 480]);
      const casted = resized.cast("int32");
      const expanded = casted.expandDims(0);
      const obj = await net.executeAsync(expanded);
      // console.log(obj)

      const boxes = await obj[2].array();
      const classes = await obj[4].array();
      const scores = await obj[6].array();

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");

      // 5. TODO - Update drawing utility
      // drawSomething(obj, ctx)

      requestAnimationFrame(() => {
        drawRect(
          boxes[0],
          classes[0],
          scores[0],
          0.8,
          videoWidth,
          videoHeight,
          ctx,
          setName
        );
      });

      tf.dispose(img);
      tf.dispose(resized);
      tf.dispose(casted);
      tf.dispose(expanded);
      tf.dispose(obj);
    }
  };

  useEffect(() => {
    runCoco();
  }, []);


  const inc = () => {
    setQuantity(quantity + 1);
  }

  const dec = () => {
    setQuantity(quantity - 1);
  }

	return (
		<Container>
			<div className="leftContainer">
			<Webcam
            ref={webcamRef}
            muted={true}
            style={{
              position: "absolute",
              marginLeft: "50px",
              marginRight: "auto",
              left: 0,
              right: 0,
              textAlign: "center",
              zindex: 9,
              width: 640,
              height: 480,
            }}
          />
		  <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              marginLeft: "50px",
              marginRight: "auto",
              left: 0,
              right: 0,
              textAlign: "center",
              zindex: 8,
              width: 640,
              height: 480,
            }}
          />
				<div
					className="returnButton"
					onClick={() => {
						// Change title
						navTitleRef.current.replace('CHOOSE')

						// Remove custom interface
						returnButton.current.remove()
						gsap.to(line.current, { duration: 0.7, scaleY: 0, ease: Power1.easeOut, delay: 0.3 })
						customSentence.current.remove(0.25)
						customButton.current.remove(0.1)
						gsap.to(keyInputMask.current, { duration: 0.85, scaleX: 1, ease: Power2.easeInOut, delay: 0.75 })
						let index = 0
						for (let i = trackbarsRefs.current.length - 1; i >= 0; i--) {
							trackbarsRefs.current[i].remove(index * 0.25 + 0.5)
							index++
						}

						// Go back to choose interface
						const goBackDelay = isFirstTimeGenerated === true ? 2600 : 1800
						setTimeout(() => {
							history.goBack()
						}, goBackDelay)
					}}
				>
					<AnimatedText text="RETURN" type="link" stagger={0.04} delay={delay * 1000 + 1200} hover={true} ref={returnButton} />
				</div>
				<div className="designTitleContainer">
					<DesignTitle index={design.index} text={design.title} displayAnim={delay === 0 ? true : false} delay={delay === 0 ? -1 : 0} />
				</div>
				<div
					className="selectButtonContainer"
					onClick={() => {
						if (canSelect) {
							console.log('select')
							sketch.current.saveToLocalStorage()

							setCanSelect(false)
						}
					}}
				>
					<Button text="ADD TO SELECTION" enable={canSelect} delay={delay + 2} />
				</div>
			</div>
			<div className="line" ref={line}></div>
			<div className="rightContainer">
				<div className="customSentenceContainer" ref={customSentenceContainer}>
					<AnimatedSentence delay={delay * 1000 + 1200} text="Name:{name} Price:{price} ID:{id}" ref={customSentence} />
				</div>
				<div className="keyInput">
					<div className="keyInputMask" ref={keyInputMask} />
					<input
						onChange={(e) => {
							e.target.value = e.target.value.toUpperCase()

							updateGenerateButton()
						}}
						onBlur={() => {
							// Encode the key
							let randomKeyCode = ''
							for (let i = 0; i < keyInput.current.value.length; i++) {
								randomKeyCode += keyInput.current.value.charCodeAt(i)
							}

							// Update the system
							sketch.current.updateValue('noiseSeed', randomKeyCode)
						}}
						className="input"
						type="text"
						ref={keyInput}
					/>
					<div
						className="newKeyButton"
						onClick={() => {
							// Generate random key
							const keyPossibility = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
							let randomKey = ''
							let randomKeyCode = ''
							for (let i = 0; i < 10; i++) {
								randomKey += keyPossibility[Math.floor(Math.random() * keyPossibility.length)]
								randomKeyCode += randomKey.charCodeAt(i)
							}

							// Update input
							keyInput.current.value = randomKey

							// Update system
							sketch.current.updateValue('noiseSeed', randomKeyCode)

							if (!isFirstTimeGenerated) {
								updateGenerateButton()
							} else {
								sketch.current.generate()
								if (!buttonIsDisable) {
									setButtonIsDisable(true)
								}

								setCanSelect(true)
							}
						}}
					>
						<NewKeyButtonImage />
					</div>
				</div>
				<div
					style={{ width: '80%' }}
					onClick={() => {
						if (!buttonIsDisable) {
							sketch.current.generate()

							setButtonIsDisable(true)

							if (!isFirstTimeGenerated) {
								transitionToTrackbars()
								customButton.current.replaceText('APPLY')
							}

							setCanSelect(true)
						}
					}}
				>
				<div className="value-button decrease_" id="" value="Decrease Value" onClick={dec}>-</div>
                {quantity}
                <div className="value-button increase_" id="" value="Increase Value " onClick={inc}>+</div>
					<Button text="ADD QUANTITY" delay={delay + 2} enable={!buttonIsDisable} ref={customButton} />
				</div>
			</div>
		</Container>
	)
}
