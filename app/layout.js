import './globals.css'

export const metadata = {
  title: 'ArtAlert',
  description: 'NFT tracking and alert interface',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
