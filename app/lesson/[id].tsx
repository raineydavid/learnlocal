import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import TranslationBar from '@/components/TranslationBar';
import LessonPlayer from '@/components/LessonPlayer';
import LessonContentRenderer from '@/components/LessonContentRenderer';

export default function LessonScreen() {
  const { id } = useLocalSearchParams();
  const [translatedContent, setTranslatedContent] = useState<string>('');
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const lessons = {
    'water-purification': {
      category: 'SCIENCE',
      title: 'Water Purification',
      description: 'Access to clean water is critical. There are various methods to purify water to make it safe for drinking',
      content: `Water purification is the process of removing undesirable chemicals, biological contaminants, suspended solids, and gases from water. The goal is to produce water fit for specific purposes.

Most water is purified and disinfected for human consumption (drinking water), but water purification may also be carried out for a variety of other purposes, including medical, pharmacological, chemical, and industrial applications.

Common methods include:
• Filtration through sand and gravel
• Chemical treatment with chlorine
• Boiling to kill bacteria and viruses
• UV light sterilization
• Reverse osmosis systems

The method shown in the diagram demonstrates a simple filtration system using layers of different materials to remove impurities from dirty water, resulting in clean, purified water suitable for drinking.`,
      image: '/assets/images/enhanced-lesson-2.png',
      categoryColor: '#4F46E5',
    },
    'good-news': {
      category: 'SOCIAL STUDIES',
      title: 'Good News From Around the World',
      description: 'Read about positive and inspiring events happening all around the world.',
      content: `In a world often filled with challenging news, it's important to highlight the positive stories that inspire hope and bring communities together.

Community Garden Feeds a Neighborhood

In a small town, residents came together to turn an empty lot into a thriving vegetable garden. The garden now produces enough fresh food to share with hundreds of families, bringing the community closer and providing healthy meals.

Lost Dog Reunited with Family After Three Years

A family who had lost their beloved dog, Buddy, three years ago were overjoyed when a shelter hundreds of miles away called to say they had found him. Thanks to a microchip, Buddy was able to return home safely.

These stories remind us that even in difficult times, there are always reasons to hope and celebrate the kindness of humanity.`,
      image: 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=800',
      categoryColor: '#059669',
    },
    'art-activities': {
      category: 'ARTS',
      title: 'Art Activities',
      description: 'Explore creative expression through various art forms and techniques.',
      content: `Art is a powerful form of self-expression that allows us to communicate ideas, emotions, and experiences in unique ways.

Creative Expression Through Art

Art activities help develop creativity, fine motor skills, and emotional intelligence. Whether through painting, drawing, sculpture, or digital art, each medium offers different ways to explore and express ideas.

Popular Art Activities:
• Watercolor painting - Learn color mixing and brush techniques
• Clay sculpture - Develop 3D thinking and hand coordination
• Collage making - Combine different materials and textures
• Digital art - Explore modern tools and techniques
• Nature art - Use natural materials for creative projects

Art not only provides a creative outlet but also helps develop problem-solving skills, patience, and the ability to see the world from different perspectives.`,
      image: 'https://images.pexels.com/photos/1193743/pexels-photo-1193743.jpeg?auto=compress&cs=tinysrgb&w=800',
      categoryColor: '#7C3AED',
    },
  };

  const lesson = lessons[id as keyof typeof lessons];

  if (!lesson) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Lesson not found</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#FFFFFF" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>LearnLocal</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {lesson.image.startsWith('http') ? (
          <Image source={{ uri: lesson.image }} style={styles.lessonImage} />
        ) : (
          <View style={styles.diagramContainer}>
            <View style={[styles.categoryBadge, { backgroundColor: lesson.categoryColor }]}>
              <Text style={styles.categoryBadgeText}>{lesson.category}</Text>
            </View>
            <Text style={styles.lessonTitle}>{lesson.title}</Text>
            <Text style={styles.lessonDescription}>{lesson.description}</Text>
            
            {id === 'water-purification' && (
              <View style={styles.waterDiagram}>
                <View style={styles.diagramTitle}>
                  <Text style={styles.diagramTitleText}>Water Purification Process</Text>
                </View>
                <View style={styles.diagramContent}>
                  <Text style={styles.diagramText}>Dirty water → Sand Filter → Purified water</Text>
                  <Text style={styles.diagramNote}>
                    The filtration system removes impurities through multiple layers of sand and gravel
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}

        <View style={styles.contentContainer}>
          <TranslationBar
            text={lesson.content}
            onTranslate={(translatedText, language) => {
              setTranslatedContent(translatedText);
              setCurrentLanguage(language);
            }}
          />
          
          <LessonPlayer 
            text={translatedContent || lesson.content}
            title={lesson.title}
          />
          
          <LessonContentRenderer 
            jsonContent={translatedContent || lesson.content}
            fallbackContent={lesson.content}
          />
          
          <TouchableOpacity style={styles.startLessonButton}>
            <Text style={styles.startLessonText}>Start Lesson</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E293B',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 60,
  },
  lessonImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  diagramContainer: {
    padding: 20,
    minHeight: 300,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  categoryBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  lessonTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    lineHeight: 40,
  },
  lessonDescription: {
    fontSize: 18,
    color: '#94A3B8',
    lineHeight: 28,
    marginBottom: 24,
  },
  waterDiagram: {
    backgroundColor: '#334155',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
  },
  diagramTitle: {
    marginBottom: 16,
  },
  diagramTitleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  diagramContent: {
    alignItems: 'center',
  },
  diagramText: {
    fontSize: 16,
    color: '#94A3B8',
    marginBottom: 12,
  },
  diagramNote: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  contentContainer: {
    padding: 20,
  },
  contentText: {
    fontSize: 16,
    color: '#94A3B8',
    lineHeight: 24,
    marginBottom: 32,
  },
  startLessonButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startLessonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#4F46E5',
  },
});