import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getBlogPosts, getCategoryLabel, formatDate } from '@/src/lib/blog'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Calendar, User, Tag, FileText, Heart } from 'lucide-react'
import type { ContentCategory } from '@/src/features/content/types'
import NewsletterSignup from './NewsletterSignup'

export const metadata: Metadata = {
  title: 'Stories, Resources, and Reflections | Forged in the Fire',
  description: 'Explore updates, practical resources, community stories, and reflections from Forged in the Fire — supporting survivors of human trafficking in Cleveland, Ohio.',
  openGraph: {
    title: 'Stories, Resources, and Reflections | Forged in the Fire',
    description: 'Explore updates, practical resources, community stories, and reflections from Forged in the Fire.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stories, Resources, and Reflections | Forged in the Fire',
    description: 'Explore updates, practical resources, community stories, and reflections.',
  },
  alternates: {
    canonical: '/blog',
  },
}

const categories: ContentCategory[] = [
  'news',
  'events',
  'impact-stories',
  'volunteer',
  'donor-updates',
  'resources',
  'partners',
  'fundraising',
]

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { category?: ContentCategory }
}) {
  const posts = await getBlogPosts({
    category: searchParams.category,
  })
  
  const featuredPosts = posts.filter(p => p.featured).slice(0, 2)
  const regularPosts = posts.filter(p => !p.featured)

  return (
    <div className="min-h-screen bg-charcoal">
      {/* Premium Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-charcoal via-charcoal-800 to-charcoal overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal/5 via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center">
            {/* Eyebrow */}
            <p className="text-teal font-medium text-sm tracking-widest uppercase mb-4">
              Publication
            </p>
            <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-cream-100 mb-6 leading-tight">
              Stories, Resources, and Reflections
            </h1>
            <p className="text-lg md:text-xl text-cream-100/70 leading-relaxed max-w-2xl mx-auto">
              Explore updates, practical resources, community stories, and reflections from Forged in the Fire.
            </p>
          </div>
        </div>
      </section>

      {/* Monthly Newsletter Section */}
      <section className="py-12 bg-charcoal-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <NewsletterSignup />
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 border-y border-charcoal-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <Link
              href="/blog"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !searchParams.category
                  ? 'bg-teal text-white'
                  : 'bg-charcoal-700 text-cream-100 hover:bg-charcoal-600'
              }`}
            >
              All Posts
            </Link>
            {categories.map((category) => (
              <Link
                key={category}
                href={`/blog?category=${category}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  searchParams.category === category
                    ? 'bg-teal text-white'
                    : 'bg-charcoal-700 text-cream-100 hover:bg-charcoal-600'
                }`}
              >
                {getCategoryLabel(category)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center">
                <span className="text-gold text-lg">★</span>
              </div>
              <h2 className="font-playfair text-2xl font-semibold text-cream-100">
                Featured Stories
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <FeaturedPostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-playfair text-2xl font-semibold text-cream-100">
              {searchParams.category ? getCategoryLabel(searchParams.category) : 'Latest Articles'}
            </h2>
            {!searchParams.category && posts.length > 0 && (
              <span className="text-cream-100/50 text-sm">
                {posts.length} {posts.length === 1 ? 'article' : 'articles'}
              </span>
            )}
          </div>
          
          {posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-charcoal-800/50 rounded-2xl border border-charcoal-700">
              <div className="w-16 h-16 rounded-full bg-charcoal-700 flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-cream-100/30" />
              </div>
              <p className="text-cream-100 font-playfair text-xl mb-2">
                {searchParams.category ? 'No articles in this category yet' : 'New stories and resources are being prepared'}
              </p>
              <p className="text-cream-100/60 max-w-md mx-auto">
                Please check back soon for new content. Subscribe to our newsletter to be notified when new articles are published.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-b from-charcoal-800 to-charcoal relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-teal/5 via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal/20 to-gold/20 flex items-center justify-center mx-auto mb-8 border border-teal/30">
              <Heart className="w-8 h-8 text-teal" />
            </div>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-cream-100 mb-4">
              Be Part of the Story
            </h2>
            <p className="text-lg text-cream-100/70 leading-relaxed mb-8 max-w-xl mx-auto">
              Your support helps us continue sharing stories of resilience, creating resources for survivors, and building a stronger community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-teal hover:bg-teal-600 text-white px-8">
                <Link href="/donate">Support Our Mission</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-cream-100/30 text-cream-100 hover:bg-cream-100/10 px-8">
                <Link href="/volunteer">Get Involved</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function FeaturedPostCard({ post }: { post: Awaited<ReturnType<typeof getBlogPosts>>[0] }) {
  return (
    <Card className="group overflow-hidden bg-charcoal-700 border-charcoal-600 hover:border-gold/50 transition-all">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-video">
          {post.featuredImage?.url ? (
            <Image
              src={post.featuredImage.url}
              alt={post.featuredImage.alt || post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-teal-900 to-charcoal-800 flex items-center justify-center">
              <span className="font-playfair text-2xl text-cream-100/30">Forged</span>
            </div>
          )}
          <div className="absolute top-4 left-4">
            <Badge className="bg-gold text-charcoal font-semibold">
              {getCategoryLabel(post.category)}
            </Badge>
          </div>
        </div>
        <CardContent className="p-6">
          <h3 className="font-playfair text-xl font-semibold text-cream-100 mb-2 group-hover:text-gold transition-colors">
            {post.title}
          </h3>
          <p className="text-cream-100/70 text-sm line-clamp-3 mb-4">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-4 text-xs text-cream-100/50">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(post.publishedAt || post.createdAt)}
            </span>
            {post.authorName && (
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {post.authorName}
              </span>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}

function PostCard({ post }: { post: Awaited<ReturnType<typeof getBlogPosts>>[0] }) {
  return (
    <Card className="group overflow-hidden bg-charcoal-700 border-charcoal-600 hover:border-teal/50 transition-all">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-video">
          {post.featuredImage?.url ? (
            <Image
              src={post.featuredImage.url}
              alt={post.featuredImage.alt || post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-charcoal-800 to-charcoal-700 flex items-center justify-center">
              <span className="font-playfair text-xl text-cream-100/20">Forged</span>
            </div>
          )}
        </div>
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary" className="bg-charcoal-600 text-cream-100/80 text-xs">
              {getCategoryLabel(post.category)}
            </Badge>
            <span className="text-xs text-cream-100/40 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(post.publishedAt || post.createdAt)}
            </span>
          </div>
          <h3 className="font-playfair text-lg font-semibold text-cream-100 mb-2 group-hover:text-teal transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-cream-100/60 text-sm line-clamp-2 mb-3">
            {post.excerpt}
          </p>
          <span className="text-sm text-teal font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
            Read More <ArrowRight className="w-4 h-4" />
          </span>
        </CardContent>
      </Link>
    </Card>
  )
}
