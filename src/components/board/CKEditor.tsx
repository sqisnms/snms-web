import { CKEditor } from "@ckeditor/ckeditor5-react"
import {
  Alignment,
  Autoformat,
  AutoImage,
  Autosave,
  BlockQuote,
  Bold,
  ClassicEditor,
  Code,
  CodeBlock,
  EditorConfig,
  Essentials,
  FindAndReplace,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  GeneralHtmlSupport,
  Heading,
  Highlight,
  HorizontalLine,
  HtmlComment,
  HtmlEmbed,
  ImageBlock,
  ImageCaption,
  ImageInline,
  ImageInsert,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  List,
  ListProperties,
  // Markdown,
  MediaEmbed,
  PageBreak,
  Paragraph,
  // PasteFromMarkdownExperimental,
  PasteFromOffice,
  RemoveFormat,
  ShowBlocks,
  SimpleUploadAdapter,
  SourceEditing,
  SpecialCharacters,
  SpecialCharactersArrows,
  SpecialCharactersCurrency,
  SpecialCharactersEssentials,
  SpecialCharactersLatin,
  SpecialCharactersMathematical,
  SpecialCharactersText,
  Strikethrough,
  Style,
  Subscript,
  Superscript,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TodoList,
  Underline,
  WordCount,
} from "ckeditor5"
import { useEffect, useMemo, useRef, useState } from "react"

import translations from "ckeditor5/translations/ko.js"

import "ckeditor5/ckeditor5.css"

import "@/styles/CKEditor.css"

/**
 * Create a free account with a trial: https://portal.ckeditor.com/checkout?plan=free
 */
const LICENSE_KEY = "GPL" // or <YOUR_LICENSE_KEY>.

export default function SnmsCKEditor({
  isEditable,
  content,
  handleSave,
}: {
  isEditable: boolean
  content: string
  handleSave: (c: string) => void
}) {
  const editorContainerRef = useRef(null)
  const editorRef = useRef<ClassicEditor | null>(null)
  const editorWordCountRef = useRef<HTMLDivElement | null>(null)
  const [isLayoutReady, setIsLayoutReady] = useState(false)
  const [isEditorReady, setIsEditorReady] = useState(false)
  const [editContent, setEditContent] = useState(content)

  useEffect(() => {
    setIsLayoutReady(true)

    return () => setIsLayoutReady(false)
  }, [])

  useEffect(() => {
    return () => {
      if (editorRef.current) {
        if (typeof editorRef.current.destroy === "function") {
          editorRef.current.destroy().catch((error) => {
            console.warn("CKEditor instance destroy error:", error)
          })
        } else {
          console.warn("Destroy method not found on editor instance:", editorRef.current)
        }
        editorRef.current = null // 인스턴스 해제
      }
    }
  }, [])

  // useEffect(() => {
  //   if (content === editContent) return
  //   handleSave(editContent)
  // }, [handleSave, editContent, content])

  const { editorConfig } = useMemo(() => {
    if (!isLayoutReady) {
      return {}
    }

    return {
      editorConfig: {
        toolbar: {
          items: [
            "sourceEditing",
            "showBlocks",
            "findAndReplace",
            "|",
            "heading",
            "style",
            "|",
            "fontSize",
            "fontFamily",
            "fontColor",
            "fontBackgroundColor",
            "|",
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "subscript",
            "superscript",
            "code",
            "removeFormat",
            "|",
            "specialCharacters",
            "horizontalLine",
            "pageBreak",
            "link",
            "insertImage",
            "mediaEmbed",
            "insertTable",
            "highlight",
            "blockQuote",
            "codeBlock",
            "htmlEmbed",
            "|",
            "alignment",
            "|",
            "bulletedList",
            "numberedList",
            "todoList",
            "outdent",
            "indent",
          ],
          shouldNotGroupWhenFull: false,
        },
        plugins: [
          Alignment,
          Autoformat,
          AutoImage,
          Autosave,
          BlockQuote,
          Bold,
          Code,
          CodeBlock,
          Essentials,
          FindAndReplace,
          FontBackgroundColor,
          FontColor,
          FontFamily,
          FontSize,
          GeneralHtmlSupport,
          Heading,
          Highlight,
          HorizontalLine,
          HtmlComment,
          HtmlEmbed,
          ImageBlock,
          ImageCaption,
          ImageInline,
          ImageInsert,
          ImageInsertViaUrl,
          ImageResize,
          ImageStyle,
          ImageTextAlternative,
          ImageToolbar,
          ImageUpload,
          Indent,
          IndentBlock,
          Italic,
          Link,
          LinkImage,
          List,
          ListProperties,
          // Markdown,
          MediaEmbed,
          PageBreak,
          Paragraph,
          // PasteFromMarkdownExperimental,
          PasteFromOffice,
          RemoveFormat,
          ShowBlocks,
          SimpleUploadAdapter,
          SourceEditing,
          SpecialCharacters,
          SpecialCharactersArrows,
          SpecialCharactersCurrency,
          SpecialCharactersEssentials,
          SpecialCharactersLatin,
          SpecialCharactersMathematical,
          SpecialCharactersText,
          Strikethrough,
          Style,
          Subscript,
          Superscript,
          Table,
          TableCaption,
          TableCellProperties,
          TableColumnResize,
          TableProperties,
          TableToolbar,
          TodoList,
          Underline,
          WordCount,
        ],
        fontFamily: {
          supportAllValues: true,
        },
        fontSize: {
          options: [10, 12, 14, "default", 18, 20, 22],
          supportAllValues: true,
        },
        heading: {
          options: [
            {
              model: "paragraph",
              title: "Paragraph",
              class: "ck-heading_paragraph",
            },
            {
              model: "heading1",
              view: "h1",
              title: "Heading 1",
              class: "ck-heading_heading1",
            },
            {
              model: "heading2",
              view: "h2",
              title: "Heading 2",
              class: "ck-heading_heading2",
            },
            {
              model: "heading3",
              view: "h3",
              title: "Heading 3",
              class: "ck-heading_heading3",
            },
            {
              model: "heading4",
              view: "h4",
              title: "Heading 4",
              class: "ck-heading_heading4",
            },
            {
              model: "heading5",
              view: "h5",
              title: "Heading 5",
              class: "ck-heading_heading5",
            },
            {
              model: "heading6",
              view: "h6",
              title: "Heading 6",
              class: "ck-heading_heading6",
            },
          ],
        },
        htmlSupport: {
          allow: [
            {
              name: /^.*$/,
              styles: true,
              attributes: true,
              classes: true,
            },
          ],
        },
        image: {
          toolbar: [
            "toggleImageCaption",
            "imageTextAlternative",
            "|",
            "imageStyle:inline",
            "imageStyle:wrapText",
            "imageStyle:breakText",
            "|",
            "resizeImage",
          ],
        },
        // initialData: article.content,
        language: "ko",
        licenseKey: LICENSE_KEY,
        link: {
          addTargetToExternalLinks: true,
          defaultProtocol: "https://",
          decorators: {
            toggleDownloadable: {
              mode: "manual",
              label: "Downloadable",
              attributes: {
                download: "file",
              },
            },
          },
        },
        list: {
          properties: {
            styles: true,
            startIndex: true,
            reversed: true,
          },
        },
        placeholder: "Type or paste your content here!",
        style: {
          definitions: [
            {
              name: "Article category",
              element: "h3",
              classes: ["category"],
            },
            {
              name: "Title",
              element: "h2",
              classes: ["document-title"],
            },
            {
              name: "Subtitle",
              element: "h3",
              classes: ["document-subtitle"],
            },
            {
              name: "Info box",
              element: "p",
              classes: ["info-box"],
            },
            {
              name: "Side quote",
              element: "blockquote",
              classes: ["side-quote"],
            },
            {
              name: "Marker",
              element: "span",
              classes: ["marker"],
            },
            {
              name: "Spoiler",
              element: "span",
              classes: ["spoiler"],
            },
            {
              name: "Code (dark)",
              element: "pre",
              classes: ["fancy-code", "fancy-code-dark"],
            },
            {
              name: "Code (bright)",
              element: "pre",
              classes: ["fancy-code", "fancy-code-bright"],
            },
          ],
        },
        table: {
          contentToolbar: [
            "tableColumn",
            "tableRow",
            "mergeTableCells",
            "tableProperties",
            "tableCellProperties",
          ],
        },
        translations: [translations],
      },
    }
  }, [isLayoutReady])

  return (
    <div className="main-container rounded-md">
      <div
        className="editor-container editor-container_classic-editor editor-container_include-style editor-container_include-word-count"
        ref={editorContainerRef}
      >
        <div className="editor-container__editor">
          <div>
            {editorConfig && (
              <CKEditor
                onReady={(editor) => {
                  if (isEditable) {
                    editor.disableReadOnlyMode("isEditable")
                    const wordCount = editor.plugins.get("WordCount")
                    editorWordCountRef.current?.appendChild(wordCount.wordCountContainer)
                  } else {
                    editor.enableReadOnlyMode("isEditable")
                    Array.from(editorWordCountRef.current?.children ?? []).forEach((child) =>
                      child.remove(),
                    )
                  }
                  setIsEditorReady(true)
                  editorRef.current = editor
                }}
                // onAfterDestroy={() => {
                //   Array.from(editorWordCountRef.current?.children ?? []).forEach((child) =>
                //     child.remove(),
                //   )
                // }}
                editor={ClassicEditor}
                config={{
                  ...(editorConfig as EditorConfig),
                  toolbar: isEditable ? editorConfig.toolbar : [],
                }}
                data={content}
                onChange={(event, editor) => {
                  if (!isEditable || !isEditorReady) return
                  const data = editor.getData()
                  setEditContent(data)
                }}
                onBlur={() => {
                  if (isEditable && editContent !== content) {
                    handleSave(editContent) // 포커스를 잃을 때 저장
                  }
                }}
              />
            )}
          </div>
        </div>
        <div className="editor_container__word-count" ref={editorWordCountRef} />
      </div>
    </div>
  )
}
