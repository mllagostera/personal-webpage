import type { RouteLocationRaw } from 'vue-router'
import type { NuxtApp } from '#app'
import type { AwesomeLayoutPageNavbarMenu } from '~/utils/types'

export interface NuxtAwesomeAppConfig {
  /** title name */
  name?: string
  /** description */
  description?: string

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
    /** footer */
    footer?: {
      /** footer year */
      year?: number
    }
    /** welcome component page */
    welcome?: {
      title?: string
      disableInfoReplaceIndexInWelcomePage?: boolean
      primaryActionButton?: {
        title?: string
        to?: RouteLocationRaw | ((nuxt: NuxtApp) => RouteLocationRaw)
      }
      secondaryActionButton?: {
        title?: string
        to?: RouteLocationRaw | ((nuxt: NuxtApp) => RouteLocationRaw)
      }
    }
  }

  /** author config */
  author?: {
    /** author name */
    name?: string
    /** author dateOfBirth */
    dateOfBirth?: string
    /** author email */
    email?: string
    /** author phoneNumber */
    phoneNumber?: string
    /** author city */
    city?: string
    /** author links */
    links?: {
      /** author github link */
      github?: string
      /** author medium link */
      medium?: string
      /** author website link */
      website?: string
    }
  }

  /** author config */
  disableInfoReplaceIndexInWelcomePage?: boolean
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
    description: '',
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
      footer: {
        year: new Date().getFullYear(),
        isDemo: false,
        isActive: true,
        link: 'https://github.com/mllagostera/nuxt-3-cv',
      },
      welcome: {
        title: 'Miquel Llagostera',
        disableInfoReplaceIndexInWelcomePage: true,
        primaryActionButton: {
          title: 'Nuxt 3',
          to: 'https://nuxt.com/',
        },
        secondaryActionButton: {
          title: 'Github',
          to: 'https://github.com/mllagostera/nuxt-3-cv',
        },
      },
    },
    author: {
      name: 'Miquel Llagostera',
      email: 'mllagosterarios@gmail.com',
      dateOfBirth: '10/07/1984',
      phoneNumber: '',
      city: 'Barcelona',
      links: {
        github: 'https://github.com/mllagostera',
        website: 'https://mllagostera.com',
        linkedin: 'https://www.linkedin.com/in/mllagostera',
      },
    },
    disableInfoReplaceIndexInWelcomePage: false,
  } as NuxtAwesomeAppConfig,
  nuxtIcon: {
    aliases: {},
    class: '',
    size: '1em',
  },
})
