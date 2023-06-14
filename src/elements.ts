import { Image, fontForText } from "@devicescript/graphics"
import { BoundingBox, Element } from "./element"
import { ContentAlign, Font, Style, StyleName, screen } from "./style"

export class ShapeElement extends Element {
    constructor(cls?: string) {
        super(cls)
    }

    protected drawSelf(bounds: BoundingBox) {
        if (this.contentBox.color) this.drawShape(bounds)
    }

    protected drawShape(bounds: BoundingBox) {
        screen.drawRect(
            bounds.left,
            bounds.top,
            bounds.width,
            bounds.height,
            this.contentBox.color
        )
    }
}

export class BoxElement extends ShapeElement {
    constructor() {
        super("box")
    }

    protected drawShape(bounds: BoundingBox) {
        screen.fillRect(
            bounds.left,
            bounds.top,
            bounds.width,
            bounds.height,
            this.contentBox.color
        )
    }
}

export class TextElement extends ShapeElement {
    text: string
    font: Font

    constructor(text?: string) {
        super("text")
        this.contentBox.color = 1
        this.contentBox.align = ContentAlign.Left
        this.font = Font.Normal
        this.setText(text)
    }

    setText(text: string) {
        this.text = text
        this.updateBounds()
    }

    applyStyle(style: Style) {
        if (style.name === StyleName.Font) {
            this.font = style.value
            this.updateBounds()
        } else {
            super.applyStyle(style)
        }
    }

    protected updateBounds() {
        const f = this.renderFont()
        this.height = f.charHeight
        if (this.text) {
            this.width = this.text.length * f.charWidth
        } else {
            this.width = 0
        }
    }

    protected drawShape(bounds: BoundingBox) {
        const pa = this.contentBox.padding
        screen.print(
            this.text,
            pa.left + bounds.left,
            pa.top + bounds.top,
            this.contentBox.color,
            this.renderFont()
        )
    }

    protected renderFont() {
        return fontForText("")
    }
}

export class ImageElement extends Element {
    protected src: Image

    constructor(src: Image) {
        super("img")

        this.src = src
        this.updateBounds()
    }

    protected updateBounds() {
        this.height = this.src.height
        this.width = this.src.width
    }

    protected drawSelf(bounds: BoundingBox) {
        const pa = this.contentBox.padding
        screen.drawTransparentImage(
            this.src,
            pa.left + bounds.left,
            pa.top + bounds.top
        )
    }
}

export class DynamicElement extends Element {
    protected drawFunction: (bounds: BoundingBox) => void

    constructor(drawFunction: (bounds: BoundingBox) => void) {
        super()
        this.drawFunction = drawFunction
    }

    protected drawSelf(bounds: BoundingBox) {
        this.drawFunction(bounds)
    }
}
