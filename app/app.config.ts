import type { AwesomeLayoutPageNavbarMenu } from '~/utils/types'

export interface NuxtAwesomeAppConfig {
  /** title name */
  name?: string

  /** project config */
  project?: {
    /** links */
    links?: {
      /** project github link */
      github?: string
      /** project linkedin link */
      linkedin?: string
      /** project x/twitter link */
      x?: string
      /** project stackshare link */
      stackshare?: string
    }
  }

  /** layout config */
  layout?: {
    /** page layout */
    page?: {
      /** navbar */
      navbar?: {
        /** menus in navbar */
        menus?: AwesomeLayoutPageNavbarMenu[]
      }
    }
  }

  /** author config */
  author?: {
    /** author name, shown as the page H1 and in twitter meta tags */
    name?: string
    /** author email, used for the mailto: contact link */
    email?: string
  }
}

declare module '@nuxt/schema' {
  interface AppConfigInput {
    awesome?: NuxtAwesomeAppConfig
  }
  interface AppConfig {
    awesome: NuxtAwesomeAppConfig
  }
}

export default defineAppConfig({
  awesome: {
    name: 'Portfolio & Resume',
    project: {
      links: {
        github: 'https://github.com/mllagostera',
        linkedin: 'https://www.linkedin.com/in/mllagostera',
        stackshare: 'https://stackshare.io/mllagostera/my-stack#stack',
        x: 'https://x.com/vansid',
      },
    },
    layout: {
      page: {
        navbar: {
          menus: [
            {
              "type": "link",
              "title": "workExperience",
              "to": "#workExperience"
            },
            {
              "type": "link",
              "title": "education",
              "to": "#education"
            },
            {
              "type": "link",
              "title": "technicalSkills",
              "to": "#technologies"
            },
            {
              "type": "link",
              "title": "projects",
              "to": "#projects"
            },
            {
              "type": "link",
              "title": "githubProjects",
              "to": "#github-collaborations",
              "icon": "devicon:github"
            }
          ],
        },
      },
    },
    author: {
      name: 'Miquel Llagostera',
      email: 'mllagosterarios@gmail.com',
    },
  } as NuxtAwesomeAppConfig,
  nuxtIcon: {
    aliases: {},
    class: '',
    size: '1em',
  },
})
