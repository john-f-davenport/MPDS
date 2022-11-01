import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { Layout, PreviewableImage, PostFeed } from '../components'
import { postPropTypes } from '../components/PostCard'
import { featuredImagePropTypes } from '../proptypes'
import { seoProps, getValidDates } from '../utils'

export const BlogArchiveTemplate = ({
  header,
  subheader,
  posts,
  featuredImage,
  isPreview,
}) => {
  const hasFeaturedImage = !!featuredImage && !!featuredImage.src
  return (
    <Fragment>
      <div
        className={`post-content page-template ${
          hasFeaturedImage ? 'with-image' : 'no-image'
        }`}
        style={{ padding: 0 }}
      >
        <header className="page-head">
          <h1 className="page-head-title">{header}</h1>
          {!!subheader && <p className="page-head-description">{subheader}</p>}
        </header>
        <section className="post-content-body">
          {hasFeaturedImage && (
            <figure
              className="gatsby-resp-image-card-full"
              style={{ marginBottom: '1rem' }}
            >
              <PreviewableImage
                isPreview={isPreview}
                src={
                  isPreview
                    ? featuredImage.src
                    : { m: featuredImage.m, d: featuredImage.d }
                }
                alt={featuredImage.alt}
                caption={featuredImage.caption}
              />
            </figure>
          )}
        </section>
      </div>
      <PostFeed isPreview={isPreview} posts={posts} />
    </Fragment>
  )
}

const BlogArchive = ({ data }) => {
  const { header, subheader, featuredImage } = data.markdownRemark.frontmatter
  const posts = data.allMarkdownRemark.edges.map(({ node }) => {
    const {
      frontmatter: { featuredImage, pageTitle, date: userDate },
      fields: { slug, gitAuthorTime, gitCreatedTime },
    } = node
    const { date } = getValidDates(userDate, gitAuthorTime, gitCreatedTime)
    return {
      image: !!featuredImage ? featuredImage : null,
      slug,
      pageTitle,
      date,
    }
  })
  const pageProps = {
    header,
    subheader,
    featuredImage,
    posts,
  }

  return (
    <Layout seoProps={seoProps(data)}>
      <BlogArchiveTemplate {...pageProps} />
    </Layout>
  )
}

BlogArchiveTemplate.propTypes = {
  header: PropTypes.string.isRequired,
  subheader: PropTypes.string,
  posts: PropTypes.arrayOf(PropTypes.shape(postPropTypes)),
  featuredImage: featuredImagePropTypes,
  isPreview: PropTypes.bool,
}

export default BlogArchive

export const pageQuery = graphql`
  query BlogArchiveTemplate {
    markdownRemark(frontmatter: { templateKey: { eq: "blog-archive" } }) {
      fields {
        slug
        gitAuthorTime
        gitCreatedTime
      }
      frontmatter {
        templateKey
        pageTitle
        metaDescription
        schemaType
        header
        subheader
        featuredImage {
          src {
            childImageSharp {
              fluid {
                originalName
              }
              original {
                height
                width
              }
            }
          }
          d: src {
            childImageSharp {
              fluid(
                maxWidth: 1200
                maxHeight: 450
                quality: 80
                cropFocus: CENTER
              ) {
                ...GatsbyImageSharpFluid_withWebp
              }
            }
          }
          m: src {
            childImageSharp {
              fluid(
                maxWidth: 900
                maxHeight: 506
                quality: 80
                cropFocus: CENTER
              ) {
                ...GatsbyImageSharpFluid_withWebp
              }
            }
          }
          square: src {
            childImageSharp {
              fluid(
                maxWidth: 420
                maxHeight: 360
                quality: 80
                cropFocus: CENTER
              ) {
                ...GatsbyImageSharpFluid_withWebp
                originalName
              }
              original {
                height
                width
              }
            }
          }
          alt
          caption
        }
      }
    }
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: {
        frontmatter: {
          templateKey: { eq: "blog-post" }
          published: { eq: true }
        }
      }
    ) {
      edges {
        node {
          fields {
            slug
            gitAuthorTime
            gitCreatedTime
          }
          frontmatter {
            date(formatString: "MMM DD, YYYY")
            pageTitle
            featuredImage {
              src {
                childImageSharp {
                  fluid {
                    originalName
                  }
                  original {
                    height
                    width
                  }
                }
              }
              m: src {
                childImageSharp {
                  fluid(maxWidth: 500, maxHeight: 664, cropFocus: CENTER) {
                    ...GatsbyImageSharpFluid_withWebp
                    originalName
                  }
                  original {
                    height
                    width
                  }
                }
              }
              d: src {
                childImageSharp {
                  fluid(maxWidth: 1000, maxHeight: 664, cropFocus: CENTER) {
                    ...GatsbyImageSharpFluid_withWebp
                    originalName
                  }
                  original {
                    height
                    width
                  }
                }
              }
              alt
            }
          }
        }
      }
    }
  }
`
